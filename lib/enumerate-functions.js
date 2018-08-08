var fs = require('fs');
var path = require('path');

const enumerateFunctions = (entry, files = []) => {
  const dir = path.resolve(entry);
  const list = fs.readdirSync(dir);

  for (var file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      enumerateFunctions(file, files);
    } else {
      files.push(file);
    }
  }

  return files.map(filePath => {
    const { dir, name } = path.parse(filePath);
    return {
      module: filePath,
      pathname: `${dir}/${name}`.replace(path.resolve(entry), '')
    };
  });
};

module.exports = enumerateFunctions;
