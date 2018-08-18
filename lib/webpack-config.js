const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CWD = process.cwd();

module.exports = (entry, targetDir, targetFilename, node, customConfigPath) => {
  const filename = targetFilename.replace(/^\//, '');
  const path = resolve(CWD, targetDir);

  const defaultConfig = {
    mode: 'production',
    entry,
    output: { path, filename, libraryTarget: 'commonjs' },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [['@babel/preset-env', { targets: { node } }]]
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

  if (!customConfigPath) {
    return defaultConfig;
  }

  const customConfig = require(resolve(CWD, customConfigPath));

  let config;

  if (typeof customConfig === 'function') {
    config = customConfig(defaultConfig);
  } else if (customConfig === Object(customConfig)) {
    config = merge.smart(defaultConfig, customConfig);
  }

  return config;
};
