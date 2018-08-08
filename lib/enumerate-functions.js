var fs = require('fs');
var path = require('path');

const CWD = process.cwd();

const listFiles = (entry, files = []) => {
  const dir = path.resolve(entry);
  const list = fs.readdirSync(dir);

  for (var file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      listFiles(file, files);
    } else {
      files.push(file);
    }
  }

  return files.map(file => path.parse(path.relative(CWD, file)));
};

const enumerateFunctions = ({ entry }) =>
  listFiles(entry).map(file => ({
    file: path.resolve(CWD, path.format(file)),
    target: file.dir.replace(entry, '') + '/' + file.base,
    requestPath: file.dir.replace(entry, '') + '/' + file.name
  }));

module.exports = enumerateFunctions;
