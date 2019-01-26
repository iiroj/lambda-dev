import * as webpack_ from "webpack";
import chalk from "chalk";

import { Entry } from "./entries";

const prefix = chalk.grey("λ-dev");

export type ResolveArgs = {
  entries: Entry[];
  hash?: string;
  modules: any[];
  warnings?: any[];
};

type RejectArgs = {
  entries: Entry[];
  error?: Error;
  errors?: any[];
  hash?: string;
};

export type BuildCallback = (args: {
  entries: Entry[];
  hash?: string;
  modules: any[];
}) => void;

export default function getBuildCallback(
  entries: Entry[],
  resolve: (args: ResolveArgs) => void,
  reject: (args: RejectArgs) => void,
  callback?: BuildCallback
): webpack_.Compiler.Handler {
  return (err, stats) => {
    if (err) {
      console.error(
        `${chalk.grey("λ-dev")} ${chalk.red("Webpack error:")}`,
        err
      );
      reject({ entries, error: err });
    }

    const { errors, hash, modules, warnings } = stats.toJson({
      assets: true,
      errors: true,
      hash: true,
      warnings: true
    });

    if (errors.length > 0) {
      for (const error of errors) {
        console.error(
          `${chalk.grey("λ-dev")} ${chalk.red("Compilation error:")}`,
          error
        );
      }
      reject({ entries, errors, hash });
    }

    if (warnings.length > 0) {
      for (const warning of warnings) {
        console.warn(
          `${chalk.grey("λ-dev")} ${chalk.red("Compilation warning:")}`,
          warning
        );
      }
    }

    console.log(`${prefix} Built ${chalk.green(hash)}`);

    if (callback) {
      callback({ entries, hash, modules });
    }

    resolve({ entries, hash, modules, warnings });
  };
}
