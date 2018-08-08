const fs = require('fs');
const babel = require('@babel/core');

const getConfig = nodeVersion => ({
  presets: [['@babel/preset-env', { targets: { node: nodeVersion } }]]
});

module.exports = (path, nodeVersion) => babel.transformFileSync(path, getConfig(nodeVersion)).code;
