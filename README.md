<h1 align="center">λ-dev</h1>
<div align="center"><code>lambda-dev</code></div>

<div align="center">
  <p>Develop and Bundle Your Lambda Functions With Ease</p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/lambda-dev">
    <img src="https://img.shields.io/npm/v/lambda-dev.svg?style=flat-square">
  </a>
</div>

## Installation

`npm install --save-dev lambda-dev`

`yarn add --dev lambda-dev`

## Usage

### Development

You can use `lambda-dev` to develop lambda functions locally. It will start an Express server that proxies your requests to your functions. Functions are transpiled with [@babel/core](https://babeljs.io/docs/en/next/babel-core) and [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env), with the node target set to `--node [target]` (default `6.10`). Transpilation happens on every request so there's no fancy reloading.

```bash
lambda-dev serve --help
lambda-dev serve src/functions --node 8.10 --port 9000 --basePath /lambda
```

Now your function `src/functions/test.js` will be available at `http://localhost:9000/lambda/test`

### Build

You can use `lambda-dev` to bundle your lambda function through [webpack](https://webpack.js.org) and babel.

```bash
lambda-dev build --help
lambda-dev serve src/functions build/functions --node 8.10
```

Now your functions will be bundled at `build/functions`.