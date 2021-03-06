import request = require("supertest");

import { createServer } from "../src/serve";

describe("serve", () => {
  let app: Express.Application;

  beforeEach(async done => {
    app = await createServer({
      basePath: "/",
      entry: "test/fixtures",
      node: "6.10",
      port: 9000,
      watch: false
    });

    done();
  });

  test("GET /handler-error", async () => {
    const response: any = await request(app).get("/handler-error");

    expect(response.statusCode).toEqual(500);
    expect(response.text).toEqual("");
  });

  test("GET /headers", async () => {
    const response: any = await request(app).get("/headers");

    expect(response.statusCode).toEqual(204);
    expect(response.headers.foo).toEqual("bar");
  });

  test("GET /hello-world", async () => {
    const response: any = await request(app).get("/hello-world");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("Hello, world!");
  });

  test("GET /base64", async () => {
    const response: any = await request(app).get("/base64");

    expect(response.statusCode).toEqual(200);
    expect(response.body.toString()).toEqual("Hello, base64!");
  });

  test("GET /internal-error", async () => {
    const response: any = await request(app).get("/internal-error");

    expect(response.statusCode).toEqual(500);
    expect(response.text).toEqual("Function invocation failed: Error");
  });

  test("GET /post-only", async () => {
    const response: any = await request(app).get("/post-only");

    expect(response.statusCode).toEqual(405);
    expect(response.text).toEqual("");
  });

  test("POST /post-only", async () => {
    const response: any = await request(app).post("/post-only");

    expect(response.statusCode).toEqual(204);
    expect(response.text).toEqual("");
  });

  test("GET /require/", async () => {
    const response: any = await request(app).get("/require/");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("Hello, world!");
  });
});
