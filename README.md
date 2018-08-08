<div align="center">
  <h1 align="center">λ-dev</h1>
  <code>lambda-dev</code>
  <br/>
    <p>Develop and Bundle Your Lambda Functions With Ease</p>
  <br/>
    <a href="https://www.npmjs.com/package/lambda-dev">
      <img src="https://img.shields.io/npm/v/lambda-dev.svg?style=flat-square">
    </a>
  <br/>
  <hr/>
</div>

## Installation

`npm install --save-dev lambda-dev`

`yarn add --dev lambda-dev`

## Usage

### Development

Use `lambda-dev` to develop lambda functions locally. `lambda-dev serve` starts an [Express](https://expressjs.com) server that proxies http requests to your lambda functions. They are transpiled with [@babel/core](https://babeljs.io/docs/en/next/babel-core) and [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env), with the node target set to `--node [target]` (default `6.10`). Transpilation happens on every request so functions are up-to-date on every invocation.

```bash
lambda-dev serve --help
lambda-dev serve src/functions --node 8.10 --port 9000 --basePath /lambda
```

Now a given function `src/functions/test.js` will be invocated with requests to `http://localhost:9000/lambda/test`.

### Build

Use `lambda-dev build` to bundle your lambda function through [webpack](https://webpack.js.org).

```bash
lambda-dev build --help
lambda-dev serve src/functions build/functions --node 8.10
```

Now bundled functions will be at `build/functions`.

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

type Callback = (err: Error | null, response: Response) => void;

exports.handler: (event: Event, context: Context, callback: Callback) => callback(error: Error | null, response: Response | null);
```