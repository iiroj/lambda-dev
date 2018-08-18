exports.handler = (event, context, callback) => {
  return callback(null, {
    statusCode: 200,
    body: process.env.NODE_ENV
  });
};
