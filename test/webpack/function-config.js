const webpack = require('webpack');

module.exports = defaultConfig => ({
  ...defaultConfig,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'OVERWRITTEN'
    })
  ]
});
