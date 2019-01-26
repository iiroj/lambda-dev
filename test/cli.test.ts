import * as CliTest from "command-line-test";

describe("cli", () => {
  test("Without arguments", async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec("ts-node ./src/cli.ts is");

    expect(error).toBeTruthy();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test("Build without entry argument", async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec(
      "ts-node ./src/cli.ts build"
    );

    expect(error).toBeTruthy();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test("Build without target argument", async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec(
      "ts-node ./src/cli.ts build test/fixtures"
    );

    expect(error).toBeTruthy();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test("Serve without entry argument", async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec(
      "ts-node ./src/cli.ts serve"
    );

    expect(error).toBeTruthy();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });
});
