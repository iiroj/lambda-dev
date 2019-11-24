import * as bodyParser from "body-parser";
import * as express from "express";
import * as chalk from "chalk";

import build from "./build";
import createHandler from "./handler";

// typescript namespace import doesn't work with Rollup
const createExpressApp = express;

const prefix = chalk.grey("λ-dev");

// handlers for all routes
const routeHandlers: { [key: string]: express.RequestHandler } = {};

const getPath = (basePath: string) => {
  const path = basePath.startsWith("/") ? basePath : "/" + basePath;
  return path.endsWith("/") ? path.replace(/\/$/, "") : path;
};

type CreateServer = CliServeArgs & {
  dev?: boolean;
  watch?: boolean;
};

export async function createServer({
  basePath,
  dev = true,
  entry,
  exclude,
  include,
  node: nodeVersion,
  port,
  watch = true,
  webpackConfig: customConfig
}: CreateServer) {
  let firstRun = true;
  const app = createExpressApp();
  app.use(bodyParser.raw());
  app.use(bodyParser.text({ type: "*/*" }));

  const path = getPath(basePath);

  await build({
    callback: ({ entries, modules }) => {
      for (const lambda of entries) {
        const requestPath = path + lambda.requestPath;
        const fnModule = modules.find(build =>
          build.identifier.includes(lambda.file)
        );

        // set new handler for requestPath
        routeHandlers[requestPath] = createHandler(
          fnModule!.source!,
          lambda.file
        );

        if (firstRun) {
          // create route that calls handler by requestPath
          app.all(requestPath, (req, res, next) =>
            routeHandlers[requestPath](req, res, next)
          );

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
}

type Serve = CliServeArgs & {
  watch?: boolean;
};

export default async function serve({
  basePath,
  entry,
  exclude,
  include,
  node: nodeVersion,
  port,
  watch,
  webpackConfig: customConfig
}: Serve) {
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

  return app.listen(port, (err: Error) => {
    if (err) {
      console.error(`${prefix} ${chalk.red("Serve error:")}`, err);
      throw err;
    } else {
      console.log(`${prefix} Serving...`);
    }
  });
}
