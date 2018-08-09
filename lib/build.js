const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const webpack = require('webpack');

const getWebpackConfig = require('./webpack-config.js');
const enumerateFunctions = require('./enumerate-functions');

const build = ({ entry, node, target }) =>
  new Promise((resolve, reject) => {
    const dir = path.resolve(target);
    const functions = enumerateFunctions({ entry, target });

    for (const lambda of functions) {
      const webpackConfig = getWebpackConfig(lambda.file, target, lambda.target, node);

      webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error('[λ-dev]: Build Error');
          reject(error);
        }

        if (stats.hasErrors()) {
          console.error('[λ-dev]: Build Error');
          for (const error of stats.compilation.errors) {
            reject(Error(error));
          }
        }

        console.error(`[λ-dev]: Built ${lambda.target}`);
        resolve();
      });
    }
  });

exports.build = build;
