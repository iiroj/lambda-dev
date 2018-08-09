const fs = require('fs');
const rimraf = require('rimraf');
const CliTest = require('command-line-test');

describe('build', () => {
  beforeAll(() => {
    rimraf.sync('./test/tmp');
  });

  it('Should print help when missing entry', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . build');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  it('Should print help text when missing target', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . build test/fixtures');

    expect(error).toMatchSnapshot();
    expect(stdout).toEqual(null);
    expect(stderr).toEqual(null);
  });

  it('Should build succesfully', async () => {
    const cli = new CliTest();
    const { error, stdout, stderr } = await cli.exec('node . build test/fixtures test/tmp');

    expect(error).toEqual(null);

    const handlerError = fs.readFileSync('./test/tmp/handler-error.js').toString('utf-8');
    expect(handlerError).toMatchSnapshot('handlerError');

    const helloWorld = fs.readFileSync('./test/tmp/hello-world.js').toString('utf-8');
    expect(helloWorld).toMatchSnapshot('helloWorld');

    const internalError = fs.readFileSync('./test/tmp/internal-error.js').toString('utf-8');
    expect(internalError).toMatchSnapshot('internalError');

    const postOnly = fs.readFileSync('./test/tmp/post-only.js').toString('utf-8');
    expect(postOnly).toMatchSnapshot('postOnly');
  });

  afterAll(() => {
    rimraf.sync('./test/tmp');
  });
});
