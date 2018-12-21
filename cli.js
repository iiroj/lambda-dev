#!/usr/bin/env node

const { listen } = require("./lib/serve");
const build = require("./lib/build");

require("yargs")(process.argv.slice(2))
  .demandCommand(1)
  .command({
    command: "serve <entry>",
    desc: "Lambda Development Server",
    builder: yargs =>
      yargs
        .positional("entry", {
          describe: "Entry file or directory of Lambda functions"
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
    handler: listen
  })
  .command({
    command: "build <entry> <target>",
    desc: "Bundle Lambda functions",
    builder: yargs =>
      yargs
        .positional("entry", {
          describe: "Relative path to entry file or directory of functions",
          type: "string"
        })
        .positional("target", {
          describe: "Relative path to target directory for bundled functions",
          type: "string"
        }),
    handler: build
  })
  .option("include", {
    alias: "i",
    describe: "Glob for including Lambda Functions from the entry set",
    type: "string"
  })
  .option("exclude", {
    alias: "e",
    describe: "Glob for excluding Lambda Functions from included set",
    type: "string"
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
  }).argv;
