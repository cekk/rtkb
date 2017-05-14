exports.formatResponse = (urls, data) => {
  return {
    "links": {
      "self": urls.self,
      "next": urls.next,
      "last": urls.last
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
  return {
    message: err.message,
    details: ''
  };
};
