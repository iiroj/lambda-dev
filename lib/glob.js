const chalk = require("chalk");
const fs = require("fs");
const globSync = require("glob/sync");
const path = require("path");

const CWD = process.cwd();

const getGlobAndCwd = entry => {
  const resolved = path.resolve(entry);
  const dirStat = fs.statSync(resolved);

  if (dirStat.isDirectory()) {
    return { glob: "*", cwd: resolved };
  } else {
    const { dir } = path.parse(resolved);
    return { glob: resolved, cwd: dir };
  }
};

module.exports = (entry = CWD, include, exclude) => {
  try {
    const { glob, cwd } = getGlobAndCwd(entry);
    let files;

    if (include) {
      files = globSync(include, {
        absolute: true,
        cwd,
        ignore: exclude,
        matchBase: true,
        nodir: true,
        root: entry
      });
    } else {
      files = globSync(glob, {
        absolute: true,
        cwd,
        ignore: exclude,
        matchBase: true,
        nodir: true
      });
    }

    return files.map(file => {
      const parsed = path.parse(file);

      return {
        file,
        target: parsed.dir.replace(cwd, "") + "/" + parsed.base,
        requestPath:
          parsed.dir.replace(cwd, "") + "/" + parsed.name.replace(/^index$/, "")
      };
    });
  } catch (err) {
    console.error(`${chalk.grey("λ-dev")} ${chalk.red("Glob error:")} %s`, err);
  }
};
