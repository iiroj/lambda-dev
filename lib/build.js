const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');

const transform = require('./babel-transform');
const enumerateFunctions = require('./enumerate-functions');

const build = ({ entry, node: nodeVersion, target }) => {
  const dir = path.resolve(target);
  const functions = enumerateFunctions(entry);

  for (const { module, pathname } of functions) {
    makeDir.sync(dir + pathname.substring(0, pathname.lastIndexOf('/')));
    const code = transform(module, nodeVersion);
    fs.writeFileSync(dir + pathname + '.js', code);
  }
};

module.exports = build;
