exports.handler = (event, context, callback) => {
  return callback(null, {
    statusCode: 200,
    body: "SGVsbG8sIGJhc2U2NCE=",
    isBase64Encoded: true
  });
};
