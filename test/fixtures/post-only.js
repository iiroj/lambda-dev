exports.handler = (event, context, callback) => {
  return callback(null, {
    statusCode: event.httpMethod === 'POST' ? 204 : 405
  });
};
