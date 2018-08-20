const path = require('path');
const fs = require('fs');
const MemoryFS = require('memory-fs');
const makeDir = require('make-dir');
const webpack = require('webpack');

const getWebpackConfig = require('./webpack-config.js');
const enumerateFunctions = require('./enumerate-functions');

const callbackFunction = (entries, resolve, reject, callback) => (err, stats) => {
  if (err) {
    console.error('[λ-dev]: Build Error:', err);
    reject({ entries, error: err });
  }

  const { errors, hash, modules, warnings } = stats.toJson({
    assets: true,
    errors: true,
    hash: true,
    warnings: true
  });

  if (errors.length > 0) {
    for (const error of errors) {
      console.error('[λ-dev]: Build Error:', error);
    }
    reject({ entries, errors, hash });
  }

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn('[λ-dev]: Build Warnging:', warning);
    }
  }

  console.log(`[λ-dev]: Built ${hash}`);

  if (callback && typeof callback === 'function') {
    callback({ entries, hash, modules });
  }

  resolve({ entries, hash, modules });
};

const build = ({ callback, dev = false, entry, node: nodeVersion, target: targetDir, webpackConfig: customConfig }) => {
  const entries = enumerateFunctions(entry);
  const config = getWebpackConfig({
    customConfig,
    dev,
    entries,
    nodeVersion,
    targetDir
  });

  const compiler = webpack(config);

  if (dev) {
    const memoryFs = new MemoryFS();
    compiler.outputFileSystem = memoryFs;
  }

  return new Promise(
    (resolve, reject) =>
      dev
        ? compiler.watch(config, callbackFunction(entries, resolve, reject, callback))
        : compiler.run(callbackFunction(entries, resolve, reject))
  );
};

module.exports = build;
