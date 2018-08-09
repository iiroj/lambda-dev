const CliTest = require('command-line-test');

describe('index', () => {
  it('Should print help text with no arguments', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node .');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });
});
