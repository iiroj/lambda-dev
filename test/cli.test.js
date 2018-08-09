const CliTest = require('command-line-test');

describe('cli', () => {
  test('Without arguments', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node .');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test('Build without entry argument', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . build');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test('Build without target argument', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . build test/fixtures');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  test('Serve without entry argument', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . serve');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });
});
