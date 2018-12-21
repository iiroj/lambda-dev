const bodyParser = require("body-parser");
const chalk = require("chalk");
const express = require("express");
const path = require("path");
const requireFromString = require("require-from-string");
const webpack = require("webpack");

const build = require("./build");

const prefix = chalk.grey("λ-dev");

const handleErr = (err, res) => {
  res.status(500).send("Function invocation failed: " + err.toString());
  return console.error(
    `${prefix} ${chalk.red("Function invocation failed:")} %s`,
    err
  );
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
  if (typeof promise.then !== "function") return;
  if (typeof callback !== "function") return;

  promise.then(res => callback(null, res)).catch(err => callback(err, null));
};

const createHandler = (source, filename) => (req, res) => {
  let lambda;

  try {
    lambda = requireFromString(source, filename);
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

const getPath = basePath => {
  const path = basePath.startsWith("/") ? basePath : "/" + basePath;
  return path.endsWith("/") ? path.replace(/\/$/, "") : path;
};

const deleteRoute = (app, path) => {
  for (route in app._router.stack) {
    if (
      app._router.stack[route].path === path ||
      app._router.stack[route].path === path.replace(/\/$/, "")
    ) {
      delete app._router.stack[route];
    }
  }

  app._router.stack = app._router.stack.filter(Boolean);
};

const createServer = async ({
  basePath,
  dev = true,
  entry,
  exclude,
  include,
  node: nodeVersion,
  port,
  watch = true,
  webpackConfig: customConfig
}) => {
  var firstRun = true;
  const app = express();
  app.use(bodyParser.raw());
  app.use(bodyParser.text({ type: "*/*" }));

  const path = getPath(basePath);

  await build({
    callback: ({ entries, modules }) => {
      for (const lambda of entries) {
        const requestPath = path + lambda.requestPath;
        const { source } = modules.find(build =>
          build.identifier.includes(lambda.file)
        );
        deleteRoute(app, requestPath);
        app.all(requestPath, createHandler(source, lambda.file));
        if (firstRun) {
          console.log(
            `${prefix} Serving Function ${chalk.green(
              `http://localhost:${port}${requestPath}`
            )}`
          );
        }
      }
      firstRun = false;
    },
    dev,
    entry,
    include,
    exclude,
    node: nodeVersion,
    webpackConfig: customConfig,
    watch
  });

  return app;
};

exports.createServer = createServer;

exports.listen = async ({
  basePath,
  entry,
  exclude,
  include,
  node: nodeVersion,
  port,
  watch,
  webpackConfig: customConfig
}) => {
  const app = await createServer({
    basePath,
    entry,
    exclude,
    include,
    node: nodeVersion,
    port,
    watch,
    webpackConfig: customConfig
  });

  return app.listen(port, err => {
    if (err) {
      console.error(`${prefix} ${chalk.red("Serve error:")} %s`, err);
      throw err;
    } else {
      console.log(`${prefix} Serving...`);
    }
  });
};
