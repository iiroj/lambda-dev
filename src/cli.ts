import * as yargs from "yargs";

import serveHandler from "./serve";
import buildHandler from "./build";

yargs
  .demandCommand(1)
  .option("include", {
    alias: "i",
    describe: "Additional glob for including Lambda Functions",
    type: "array"
  })
  .option("exclude", {
    alias: "e",
    describe: "Glob for excluding Lambda Functions from the included set",
    type: "array"
  })
  .option("node", {
    alias: "n",
    default: "8.10",
    description: "Target Node.js version, used with @babel/preset-env",
    type: "string"
  })
  .option("webpack-config", {
    alias: "w",
    description:
      "Relative path to optional Webpack configuration. The default export should be an object that is merged with the default webpack config, or a function that receives the default configuration and returns a valid webpack configuration.",
    type: "string"
  })
  .option("watch", {
    description:
      "Control the webpack watch mode. Defaults to true for serve and false for build.",
    type: "boolean"
  })
  .command<CliServeArgs>({
    command: "serve <entry>",
    describe: "Lambda Development Server",
    builder: (yargs: any) =>
      yargs
        .positional("entry", {
          describe: "Entry glob for Lambda functions"
        })
        .option("basePath", {
          alias: "b",
          default: "/",
          description: "Base pathname prepended to function filenames",
          type: "string"
        })
        .option("port", {
          alias: "p",
          default: 9000,
          description: "Port for development server",
          type: "number"
        }),
    handler: serveHandler
  })
  .command<CliBuildArgs>({
    command: "build <entry> <target>",
    describe: "Bundle Lambda functions",
    builder: (yargs: any) =>
      yargs
        .positional("entry", {
          describe: "Relative path to entry file or directory of functions",
          type: "string"
        })
        .positional("target", {
          describe: "Relative path to target directory for bundled functions",
          type: "string"
        }),
    handler: buildHandler
  }).argv;
