const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const webpack = require('webpack');

const getWebpackConfig = require('./webpack-config.js');
const enumerateFunctions = require('./enumerate-functions');

const build = ({ entry, node, target }) => {
  const dir = path.resolve(target);
  const functions = enumerateFunctions({ entry, target });

  const builds = [];

  for (const lambda of functions) {
    const webpackConfig = getWebpackConfig(lambda.file, target, lambda.target, node);

    builds.push(
      new Promise((resolve, reject) =>
        webpack(webpackConfig, (err, stats) => {
          if (err) {
            console.error('[λ-dev] Build Error:', error);
            reject(`[λ-dev]: Build Error: ${error}`);
          }

          if (stats.hasErrors()) {
            for (const error of stats.compilation.errors) {
              console.error('[λ-dev] Build Error:', error);
            }
            reject(`[λ-dev] Build Error: ${stats.compilation.errors}`);
          }

          console.log('[λ-dev] Built:', lambda.target);
          resolve(`[λ-dev] Built: ${lambda.target}`);
        })
      )
    );
  }

  return Promise.all(builds);
};

exports.build = build;
