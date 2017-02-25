exports.formatResponse = (request, data) => {
  return {
    "links": {
      "self": request.path,
      "next": request.path,
      "last": request.path
    },
    "data": data
  };
};

exports.formatErrorResponse = (request, error, data) => {
  return {
    "errors": [
      {
        "status": error.code,
        "source": {
          "pointer": request.path
        },
        "title":  error.message,
        "detail": error.detail
      }
    ],
    "data": data
  };
};

exports.parseError = (err) => {
  if (err.code === 11000) {
    return {
      message: 'duplicate entry',
      details: ''
    };
  }
  return {
    message: err.messsage,
    details: ''
  };
};
