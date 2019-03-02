import * as fs from "fs";

import build from "../src/build";

const args = { entry: "test/fixtures", node: "6.10", target: "test/tmp" };

test("build", async () => {
  await build(args);

  const handlerError = fs
    .readFileSync("./test/tmp/handler-error.js")
    .toString("utf-8");
  expect(handlerError.includes("{statusCode:500}")).toBeTruthy();

  const helloWorld = fs
    .readFileSync("./test/tmp/hello-world.js")
    .toString("utf-8");
  expect(helloWorld.includes("Hello, world!")).toBeTruthy();

  const internalError = fs
    .readFileSync("./test/tmp/internal-error.js")
    .toString("utf-8");
  expect(internalError.includes("Error")).toBeTruthy();

  const postOnly = fs.readFileSync("./test/tmp/post-only.js").toString("utf-8");
  expect(postOnly.includes("httpMethod?204:405}")).toBeTruthy();
});
