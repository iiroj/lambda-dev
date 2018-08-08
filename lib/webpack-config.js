const { resolve } = require('path');
const webpack = require('webpack');

module.exports = (entry, target, pathname, node) => {
  const filename = pathname.replace(/^\//, '') + '.js';
  const path = resolve(process.cwd(), target);

  return {
    mode: 'production',
    entry,
    output: { path, filename },
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
