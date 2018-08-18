var fs = require('fs');
var path = require('path');

const CWD = process.cwd();

const listFiles = (entry, files = []) => {
  const dir = path.resolve(entry);
  const dirStat = fs.statSync(dir);

  if (!dirStat.isDirectory()) {
    return path.parse(path.relative(CWD, dir));
  }

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

const enumerateFunctions = ({ entry }) => {
  const files = listFiles(entry);

  if (Array.isArray(files)) {
    return files.map(file => ({
      file: path.resolve(CWD, path.format(file)),
      target: file.dir.replace(entry, '') + '/' + file.base,
      requestPath: file.dir.replace(entry, '') + '/' + file.name
    }));
  } else {
    return [
      {
        file: path.resolve(CWD, path.format(files)),
        target: '/' + files.base,
        requestPath: '/' + files.name
      }
    ];
  }
};

module.exports = enumerateFunctions;
