const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CWD = process.cwd();

module.exports = ({ customConfig, dev = false, entries, nodeVersion, targetDir }) => {
  const path = targetDir ? resolve(CWD, targetDir) : undefined;

  const entry = entries.reduce((accumulator, entry) => {
    const key = entry.requestPath.replace(/^\//, '');
    accumulator[key] = entry.file;
    return accumulator;
  }, {});

  const defaultConfig = {
    mode: dev ? 'development' : 'production',
    watch: dev,
    entry,
    output: { filename: '[name].js', libraryTarget: 'commonjs', path },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [['@babel/preset-env', { targets: { node: nodeVersion } }]]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };

  if (!customConfig) {
    return defaultConfig;
  }

  const config = require(resolve(CWD, customConfig));

  let mergedConfig;

  if (typeof config === 'function') {
    mergedConfig = config(defaultConfig);
  } else {
    mergedConfig = merge.smart(defaultConfig, config);
  }

  return mergedConfig;
};
