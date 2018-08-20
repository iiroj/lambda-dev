const request = require('supertest');

describe('serve', () => {
  let app;

  beforeEach(async done => {
    app = await require('../lib/serve').createServer({
      basePath: '/',
      entry: 'test/fixtures',
      node: '6.10',
      watch: false
    });

    done();
  });

  test('GET /handler-error', async () => {
    const response = await request(app).get('/handler-error');

    expect(response.statusCode).toEqual(500);
    expect(response.text).toEqual('');
  });

  test('GET /headers', async () => {
    const response = await request(app).get('/headers');

    expect(response.statusCode).toEqual(204);
    expect(response.headers.foo).toEqual('bar');
  });

  test('GET /hello-world', async () => {
    const response = await request(app).get('/hello-world');

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual('Hello, world!');
  });

  test('GET /internal-error', async () => {
    const response = await request(app).get('/internal-error');

    expect(response.statusCode).toEqual(500);
    expect(response.text).toEqual('Function invocation failed: Error');
  });

  test('GET /post-only', async () => {
    const response = await request(app).get('/post-only');

    expect(response.statusCode).toEqual(405);
    expect(response.text).toEqual('');
  });

  test('POST /post-only', async () => {
    const response = await request(app).post('/post-only');

    expect(response.statusCode).toEqual(204);
    expect(response.text).toEqual('');
  });

  test('GET /require/', async () => {
    const response = await request(app).get('/require/');

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual('Hello, world!');
  });
});
