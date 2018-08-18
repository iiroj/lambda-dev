const fs = require('fs');
const rimraf = require('rimraf');

const { build } = require('../../lib/build');

describe('Custom Webpack Config', () => {
  beforeAll(() => {
    rimraf.sync('./test/tmp');
  });

  it('Should merge configuration object', async () => {
    const status = await build({
      entry: 'test/webpack/object-handler.js',
      node: '6.10',
      target: 'test/tmp',
      webpackConfig: 'test/webpack/object-config.js'
    });

    expect(status).toMatchSnapshot('build');

    const handler = fs.readFileSync('./test/tmp/object-handler.js').toString('utf-8');
    expect(handler).toMatchSnapshot('handler');
  });

  it('Should use configuration returned by function', async () => {
    const status = await build({
      entry: 'test/webpack/function-handler.js',
      node: '6.10',
      target: 'test/tmp',
      webpackConfig: 'test/webpack/function-config.js'
    });

    expect(status).toMatchSnapshot('build');

    const handler = fs.readFileSync('./test/tmp/function-handler.js').toString('utf-8');
    expect(handler).toMatchSnapshot('handler');
  });

  // afterAll(() => {
  //   rimraf.sync('./test/tmp');
  // });
});
