import * as fs from "fs";
import * as rimraf from "rimraf";

import build from "../../src/build";

jest.spyOn(global.console, "warn");

describe("Custom Webpack Config", () => {
  beforeAll(() => {
    rimraf.sync("./test/tmp");
  });

  test("Merging configuration object", async () => {
    await build({
      entry: "test/webpack/object-handler.js",
      node: "6.10",
      target: "test/tmp",
      webpackConfig: "test/webpack/object-config.js"
    });

    const handler = fs
      .readFileSync("./test/tmp/object-handler.js")
      .toString("utf-8");
    expect(handler).toMatchSnapshot("handler");
  });

  test("Configuration function", async () => {
    await build({
      entry: "test/webpack/function-handler.js",
      node: "6.10",
      target: "test/tmp",
      webpackConfig: "test/webpack/function-config.js"
    });

    const handler = fs
      .readFileSync("./test/tmp/function-handler.js")
      .toString("utf-8");
    expect(handler).toMatchSnapshot("handler");
  });

  test("Invalid configuration", async () => {
    await expect(
      build({
        entry: "test/webpack/function-handler.js",
        node: "6.10",
        target: "test/tmp",
        webpackConfig: "test/webpack/invalid-config.js"
      })
    ).rejects.toBeTruthy();
  });

  test("Invalid code in handler 1", async () => {
    await expect(
      build({
        entry: "test/webpack/invalid-handler1.js",
        node: "6.10",
        target: "test/tmp"
      })
    ).rejects.toBeTruthy();
  });

  test("Invalid code in handler 2", async () => {
    await expect(
      build({
        entry: "test/webpack/invalid-handler2.js",
        node: "6.10",
        target: "test/tmp"
      })
    ).resolves.toBeTruthy();

    expect(console.warn).toHaveBeenCalled();
  });

  afterAll(() => {
    rimraf.sync("./test/tmp");
  });
});
