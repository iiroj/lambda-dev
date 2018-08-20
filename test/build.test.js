const fs = require('fs');
const rimraf = require('rimraf');

const build = require('../lib/build');
const args = { entry: 'test/fixtures', node: '6.10', target: 'test/tmp' };

describe('build', () => {
  beforeAll(() => {
    rimraf.sync('./test/tmp');
  });

  it('Should build succesfully', async () => {
    await build(args);

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
