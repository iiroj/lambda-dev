const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const webpack = require('webpack');

const getWebpackConfig = require('./webpack-config.js');
const enumerateFunctions = require('./enumerate-functions');

const build = ({ entry, node, target }) => {
  const dir = path.resolve(target);
  const functions = enumerateFunctions({ entry, target });

  for (const lambda of functions) {
    const webpackConfig = getWebpackConfig(lambda.file, target, lambda.target, node);

    webpack(webpackConfig, (err, stats) => {
      if (err) {
        console.error('[λ-dev]: Build Error');
        throw err;
      }

      if (stats.hasErrors()) {
        console.error('[λ-dev]: Build Error');
        for (const error of stats.compilation.errors) {
          throw new Error(error);
        }
      }

      console.error(`[λ-dev]: Built ${lambda.module}`);
    });
  }
};

module.exports = build;
