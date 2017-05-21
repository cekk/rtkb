const models = require('../../models');
const jsonutils = require('../../utils/jsonutils');
const util = require('util');

exports.home = function (request, reply) {
  models.Application.findAll()
    .then((applications) => reply(jsonutils.formatResponse(request, applications)))
    .catch(err => {
      console.trace(error);
      return reply({
        'status': 500,
        'error': error.message,
      });
  });
};

exports.addApplication = function (request, reply) {
  const parameters = request.payload;
  models.Application.create(parameters)
    .then((data) => {
      const urls = {
        self: '/applications/' + data._id
      };
      return reply(jsonutils.formatResponse(urls, data)).code(201);
    })
    .catch((err) => {
      const parsedError = jsonutils.parseError(err.errors[0]);
      const urls = {
        self: request.path
      };
      return reply(jsonutils.formatErrorResponse(urls, {
        code: 500,
        message: parsedError.message,
        detail: parsedError.detail
      })).code(500);
    });
};

exports.deleteApplication = function (request, reply) {
  const applicationId = request.params.id;
  const urls = { self: request.path };
  models.Application.destroy({
    where: { id: applicationId }
  })
    .then(() => reply(jsonutils.formatResponse(urls, {})).code(200))
    .catch((err) => {
      console.trace(err);
      const parsedError = jsonutils.parseError(err);
      return reply(jsonutils.formatErrorResponse(urls, {
        code: 500,
        message: parsedError.message,
        detail: parsedError.detail
      })).code(500);
    });
};

exports.applicationDetails = function (request, reply) {
  const applicationId = request.params.id;
  const urls = {
    self: request.path
  };
  return models.Application.findById(applicationId)
    .then((application) => reply(jsonutils.formatResponse(urls, application)).code(!application ? 404 : 200));
};

exports.modifyApplication = function (request, reply) {
  const applicationId = request.params.id;
  const parameters = request.query;
  const urls = {
    self: request.path
  };
  models.Application.findById(applicationId)
    .then((application) => {
      if (application) {
        application.updateAttributes(parameters)
          .then((data) => reply.redirect('/applications/' + data.id))
      }
    })
    .catch((err) => {
      console.trace(err);
      const parsedError = jsonutils.parseError(err);
      return reply(jsonutils.formatErrorResponse(urls, {
        code: 500,
        message: parsedError.message,
        detail: parsedError.detail
      })).code(500);
    });
};
