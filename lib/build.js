const chalk = require("chalk");
const fs = require("fs");
const makeDir = require("make-dir");
const MemoryFS = require("memory-fs");
const path = require("path");
const webpack = require("webpack");

const getWebpackConfig = require("./webpack-config.js");
const globEntries = require("./glob");

const prefix = chalk.grey("λ-dev");

const getCallback = (entries, resolve, reject, callback) => (err, stats) => {
  if (err) {
    console.error(`${chalk.grey("λ-dev")} ${chalk.red("Webpack error:")}`, err);
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
      console.error(
        `${chalk.grey("λ-dev")} ${chalk.red("Compilation error:")}`,
        error
      );
    }
    reject({ entries, errors, hash });
  }

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn(
        `${chalk.grey("λ-dev")} ${chalk.red("Compilation warning:")}`,
        warning
      );
    }
  }

  console.log(`${prefix} Built ${chalk.green(hash)}`);

  if (callback && typeof callback === "function") {
    callback({ entries, hash, modules });
  }

  resolve({ entries, hash, modules, warnings });
};

module.exports = ({
  callback,
  dev = false,
  entry,
  exclude,
  include,
  node: nodeVersion,
  target: targetDir,
  watch = false,
  webpackConfig: customConfig
}) =>
  new Promise((resolve, reject) => {
    const entries = globEntries(entry, include, exclude);

    try {
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

      watch
        ? compiler.watch(
            config,
            getCallback(entries, resolve, reject, callback)
          )
        : compiler.run(getCallback(entries, resolve, reject, callback));
    } catch (err) {
      console.error(`${chalk.grey("λ-dev")} ${chalk.red("Build error:")}`, err);
      reject({ entries, error: err });
    }
  });
