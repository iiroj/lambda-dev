const requireFromString = require('require-from-string');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const transform = require('./babel-transform');
const enumerateFunctions = require('./enumerate-functions');

const handleErr = (err, res) => {
  res.status(500).send('Function invocation failed: ' + err.toString());
  return console.log('[λ-dev]: Function invocation failed: ', err);
};

const createCallback = res => (err, lambdaRes) => {
  if (err) return handleErr(err, res);

  res.status(lambdaRes.statusCode);

  for (const key in lambdaRes.headers) {
    res.setHeader(key, lambdaRes.headers[key]);
  }

  res.send(lambdaRes.body);
};

const promiseCallback = (promise, callback) => {
  if (!promise) return;
  if (typeof promise.then !== 'function') return;
  if (typeof callback !== 'function') return;

  promise.then(res => callback(null, res)).catch(err => callback(err, null));
};

const createHandler = (file, nodeVersion) => (req, res) => {
  let lambda;

  try {
    lambda = requireFromString(transform(file, nodeVersion), file);
  } catch (err) {
    return handleErr(err, res);
  }

  const event = {
    path: req.path,
    httpMethod: req.method,
    queryStringParameters: req.query,
    headers: req.headers,
    body: req.body
  };

  const callback = createCallback(res);
  const promise = lambda.handler(event, {}, callback);
  promiseCallback(promise, callback);
};

const getPath = basePath => (basePath.endsWith('/') ? basePath.replace(/\/$/, '') : basePath);

const createDevServer = ({ basePath, entry, node: nodeVersion, port }) => {
  const path = getPath(basePath);
  const functions = enumerateFunctions({ entry });

  const app = express();
  app.use(bodyParser.raw());
  app.use(bodyParser.text({ type: '*/*' }));

  app.get('/favicon.ico', (req, res) => res.status(204).end());

  for (const lambda of functions) {
    app.all(path + lambda.requestPath, createHandler(lambda.file, nodeVersion));
  }

  return app;
};

const serve = ({ basePath, entry, node: nodeVersion, port }) => {
  const path = getPath(basePath);
  const app = createDevServer({ basePath, entry, node: nodeVersion, port });

  app.listen(port, err => {
    if (err) {
      console.error('[λ-dev]: Serve Error:', err);
      throw err;
    }
    console.log(`[λ-dev]: Server Listening at http://localhost:${port}${path}/[function_name]`);
  });
};

exports.createDevServer = createDevServer;
exports.serve = serve;
