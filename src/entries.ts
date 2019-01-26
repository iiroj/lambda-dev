import chalk from "chalk";
import * as fs from "fs";
import { sync } from "fast-glob";
import * as path from "path";

const CWD = process.cwd();

export const getGlobAndCwd = (entry: string) => {
  const resolved = path.resolve(entry);
  const dirStat = fs.statSync(resolved);

  if (dirStat.isDirectory()) {
    return { glob: "**/*", cwd: resolved };
  } else {
    const { dir } = path.parse(resolved);
    return { glob: resolved, cwd: dir };
  }
};

export type Entry = {
  file: string;
  target: string;
  requestPath: string;
};

export default function getEntries(
  entry: string = CWD,
  include?: string[],
  exclude: string[] = []
): Entry[] | undefined {
  try {
    const { glob, cwd } = getGlobAndCwd(entry);
    const files = sync<string>(include || glob, {
      absolute: true,
      cwd: entry,
      ignore: exclude,
      matchBase: true,
      onlyFiles: true,
      stats: false // return file path string
    });

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
    console.error(`${chalk.grey("λ-dev")} ${chalk.red("Glob error:")}`, err);
  }
}
