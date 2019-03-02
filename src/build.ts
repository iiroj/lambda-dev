import * as webpack_ from "webpack";
import chalk from "chalk";

import getBuildCallback, { BuildCallback, ResolveArgs } from "./buildCallback";
import getEntries from "./entries";
import getWebpackConfig from "./webpack";
import purgeRequireCache from "./purgeRequireCache";

// bad typings
const MemoryFS = require("memory-fs");
// typescript namespace import doesn't work with Rollup
const webpack = webpack_;

type Build = CliBuildArgs & {
  callback?: BuildCallback;
  dev?: boolean;
};

export default function build({
  callback,
  dev = false,
  entry,
  exclude,
  include,
  node: nodeVersion,
  target: targetDir,
  watch = false,
  webpackConfig: customConfig
}: Build) {
  return new Promise<ResolveArgs>((resolve, reject) => {
    const entries = getEntries(entry, include, exclude)!;

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
        compiler.hooks.watchRun.tapAsync("lambda-dev", purgeRequireCache);
      }

      const buildCallback = getBuildCallback(
        entries,
        resolve,
        reject,
        callback
      );

      watch ? compiler.watch({}, buildCallback) : compiler.run(buildCallback);
    } catch (err) {
      console.error(`${chalk.grey("λ-dev")} ${chalk.red("Build error:")}`, err);
      reject({ entries, error: err });
    }
  });
}
