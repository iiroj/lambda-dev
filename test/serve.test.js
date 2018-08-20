const request = require('supertest');

const serve = require('../lib/serve');

const args = { basePath: '/', entry: 'test/fixtures', node: '6.10', port: '9000' };

describe('serve', () => {
  let app;

  beforeAll(async () => {
    app = await serve(args);
  });

  test('GET /handler-error', () =>
    request(app)
      .get('/handler-error')
      .then(response => {
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual('');
      }));

  test('GET /hello-world', () =>
    request(app)
      .get('/hello-world')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Hello, world!');
      }));

  test('GET /internal-error', () =>
    request(app)
      .get('/internal-error')
      .then(response => {
        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual('Function invocation failed: Error');
      }));

  test('GET /post-only', () =>
    request(app)
      .get('/post-only')
      .then(response => {
        expect(response.statusCode).toEqual(405);
        expect(response.text).toEqual('');
      }));

  test('POST /post-only', () =>
    request(app)
      .post('/post-only')
      .then(response => {
        expect(response.statusCode).toEqual(204);
        expect(response.text).toEqual('');
      }));

  test('GET /require', () =>
    request(app)
      .post('/require')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Hello, world!');
      }));
});
