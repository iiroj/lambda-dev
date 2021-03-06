import { resolve } from "path";
import * as webpack from "webpack";
import * as merge from "webpack-merge";

import { Entry } from "./entries";

const CWD = process.cwd();

type GetWebpackConfig = {
  customConfig?: string;
  dev?: boolean;
  entries: Entry[];
  nodeVersion: string;
  targetDir?: string;
};

export default function getWebpackConfig({
  customConfig,
  dev = false,
  entries,
  nodeVersion,
  targetDir = "."
}: GetWebpackConfig) {
  const path = resolve(CWD, targetDir);

  const entry = entries.reduce(
    (previous, { entry, file }) => ({ ...previous, [entry]: file }),
    {} as { [key: string]: string }
  );

  const defaultConfig: webpack.Configuration = {
    mode: dev ? "development" : "production",
    watch: dev,
    entry,
    output: { filename: "[name].js", libraryTarget: "commonjs", path },
    target: "node",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                ["@babel/preset-env", { targets: { node: nodeVersion } }]
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };

  if (!customConfig) {
    return defaultConfig;
  }

  const config = require(resolve(CWD, customConfig));

  const mergedConfig: webpack.Configuration =
    typeof config === "function"
      ? config(defaultConfig)
      : merge.smart(defaultConfig, config);

  return mergedConfig;
}
