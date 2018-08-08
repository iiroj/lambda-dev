const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const webpack = require('webpack');

const getWebpackConfig = require('./webpack-config.js');
const enumerateFunctions = require('./enumerate-functions');

const build = ({ entry, node, target }) => {
  const dir = path.resolve(target);
  const functions = enumerateFunctions(entry);

  for (const lambda of functions) {
    const webpackConfig = getWebpackConfig(lambda.module, target, lambda.pathname, node);

    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error('[λ-dev]: Build Error');
        throw err;
      }
      console.error(`[λ-dev]: Built ${lambda.module}`);
    });
  }
};

module.exports = build;
