exports.handler = (event, context, callback) => {
  return callback(null, {
    statusCode: 204,
    headers: {
      foo: "bar"
    }
  });
};
