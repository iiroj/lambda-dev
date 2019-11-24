import * as express from "express";
import * as requireFromString_ from "require-from-string";
import * as chalk from "chalk";

// typescript namespace import doesn't work with Rollup
const requireFromString = requireFromString_;

const prefix = chalk.grey("λ-dev");

const handleError = (error: Error | null, res: express.Response) => {
  res.status(500);
  res.send("Function invocation failed: " + error);
  return console.error(
    `${prefix} ${chalk.red("Function invocation failed:")}`,
    error
  );
};

const createCallback = (res: express.Response) =>
  function callback(error: Error | null, lambdaRes: LambdaEvent | null) {
    if (error || !lambdaRes) {
      return handleError(error, res);
    }

    res.status(lambdaRes.statusCode);

    for (const key in lambdaRes.headers) {
      res.setHeader(key, lambdaRes.headers[key]);
    }

    res.send(
      lambdaRes.isBase64Encoded
        ? Buffer.from(lambdaRes.body, "base64")
        : lambdaRes.body
    );
  };

async function promiseCallback(
  promise: Promise<LambdaEvent> | undefined,
  callback: ReturnType<typeof createCallback> | undefined
) {
  if (!promise) return;
  if (typeof callback !== "function") return;

  try {
    const res = await promise;
    callback(null, res);
  } catch (error) {
    callback(error, null);
  }
}

type Event = {
  path: express.Request["path"];
  httpMethod: express.Request["method"];
  queryStringParameters: express.Request["query"];
  headers: express.Request["headers"];
  body: express.Request["body"];
};

type CallbackFn = (error: Error | null, response: LambdaEvent | null) => void;

type Handler = (
  event: Event,
  context: {},
  callback: CallbackFn
) => Promise<LambdaEvent>;

const createHandler = (
  source: string,
  filename: string
): express.RequestHandler =>
  function handler(req, res) {
    let lambda: { handler: Handler } = requireFromString(source, filename);

    const event = {
      path: req.path,
      httpMethod: req.method,
      queryStringParameters: req.query,
      headers: req.headers,
      body: req.body
    };

    const callback = createCallback(res);
    const promise = lambda.handler(event, {}, callback);
    promiseCallback(promise, callback).catch();
  };

export default createHandler;
