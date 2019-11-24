import * as chalk from "chalk";
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
  entry: string;
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
    const files = sync(include || glob, {
      absolute: true,
      baseNameMatch: true,
      cwd: entry,
      ignore: exclude,
      onlyFiles: true,
      stats: false // return file path string
    });

    return files.map(file => {
      const parsed = path.parse(file);
      const basePath = parsed.dir.replace(cwd, "");

      return {
        file,
        entry: (basePath ? basePath + "/" : "") + parsed.name,
        target: basePath + "/" + parsed.base,
        requestPath: basePath + "/" + parsed.name.replace(/^index$/, "")
      };
    });
  } catch (err) {
    console.error(`${chalk.grey("λ-dev")} ${chalk.red("Glob error:")}`, err);
  }
}
