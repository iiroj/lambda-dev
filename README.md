<div align="center">
  <h1 align="center">λ-dev</h1>
  <code>lambda-dev</code>
  <br/>
  <p>Develop and Bundle Your Lambda Functions With Ease</p>
  <a href="https://www.npmjs.com/package/lambda-dev"><strong>npm</strong></a> ·
  <a href="https://github.com/iiroj/lambda-dev"><strong>GitHub</strong></a> ·
  <a href="https://gitlab.com/iiroj/lambda-dev"><strong>GitLab</strong></a>
  <br/>
  <br/>
  <a href="https://www.npmjs.com/package/lambda-dev">
    <img src="https://img.shields.io/npm/v/lambda-dev.svg">
  </a>
  <a href="https://github.com/iiroj/lambda-dev">
    <img src="https://img.shields.io/github/languages/code-size/iiroj/lambda-dev.svg">
  </a>
  <a href="https://github.com/iiroj/lambda-dev/blob/master/package.json">
    <img src="https://img.shields.io/david/iiroj/lambda-dev.svg">
  </a>
  <a href="https://github.com/iiroj/lambda-dev/blob/master/package.json">
    <img src="https://img.shields.io/david/dev/iiroj/lambda-dev.svg">
  </a>
  <br/>
  <br/>
</div>

## Installation

`npm install --save-dev lambda-dev`

`yarn add --dev lambda-dev`

## Usage

### Development

Use `lambda-dev` to develop lambda functions locally. `lambda-dev serve` starts an [Express](https://expressjs.com) server that proxies http requests to your lambda functions. They are transpiled with [@babel/core](https://babeljs.io/docs/en/next/babel-core) and [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env), with the node target set to `--node [target]` (default `6.10`). This is done through [webpack](https://webpack.js.org) with the help of [babel-loader](https://github.com/babel/babel-loader).

```bash
lambda-dev serve --help
lambda-dev serve src/functions --node 8.10 --port 9000 --basePath /lambda
```

Now a given function `src/functions/test.js` will be invoked with requests to `http://localhost:9000/lambda/test`.

### Build

```bash
lambda-dev build --help
lambda-dev serve src/functions build/functions --node 8.10
```

Bundled functions will be at `build/functions`.

## Custom Webpack configuration

It is possible to supply a custom Webpack configuration for serving and building your Lambda functions:

```bash
lambda-dev serve src/functions --webpack-config ./my-webpack.config.js
```

where the default export of `my-webpack.config.js` should be either and object or a function. If it's an object, it will be merged with the default configuration using `merge.smart` from [webpack-merge](https://github.com/survivejs/webpack-merge). If it's a function, it will receive the default configuration as its argument and should return a full valid configuration.

## Custom babel configuration

It's not possible to directly supply a custom babel configuration, but you can override the webpack configuration's [babel-loader](https://github.com/babel/babel-loader) options:

```javascript
const myBabelOptions = require('./my-babel.config.js');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            options: myBabelOptions
          }
        }
      }
    ]
  }
};
```

## Lambda Function Specification

### [Read the official docs](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)

Lambda functions should export a `handler` function that receives the following arguments:

```javascript
import { Request } from 'express';

type Event = {
  path: Request.path,
  httpMethod: Request.method,
  queryStringParameters: Request.query,
  headers: Request.headers,
  body: Request.body
};

type Context = {} // Empty with `lambda-dev serve`

exports.handler: (event: Event, context: Context, callback) => callback(error: Error | null, response: Response | null);
```
