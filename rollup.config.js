import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "src/cli.ts",
  output: {
    file: pkg.bin,
    format: "cjs",
    banner: "#!/usr/bin/env node"
  },
  external: [
    ...Object.keys(pkg.dependencies),
    "fs",
    "path"
  ],
  plugins: [
    typescript({
      typescript: require("typescript")
    })
  ]
};
