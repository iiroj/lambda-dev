const { resolve } = require('path');
const webpack = require('webpack');

module.exports = (entry, targetDir, targetFilename, node) => {
  const filename = targetFilename.replace(/^\//, '');
  const path = resolve(process.cwd(), targetDir);

  return {
    mode: 'production',
    entry,
    output: { path, filename },
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
};
