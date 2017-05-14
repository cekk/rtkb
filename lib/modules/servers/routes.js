const models = require('../../models');
const jsonutils = require('../../utils/jsonutils');
const util = require('util');

exports.home = function (request, reply) {
  models.Server.findAll()
    .then((servers) => reply(jsonutils.formatResponse(request, servers)))
    .catch(err => {
      console.trace(error);
      return reply({
        'status': 500,
        'error': error.message,
      });
  });
};

exports.addServer = function (request, reply) {
  const parameters = request.payload;
  models.Server.create(parameters)
    .then((data) => {
      const urls = {
        self: '/servers/' + data._id
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

exports.deleteServer = function (request, reply) {
  const serverId = request.params.id;
  const urls = { self: request.path };
  models.Server.destroy({
    where: { id: serverId }
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

exports.serverDetails = function (request, reply) {
  const serverId = request.params.id;
  const urls = {
    self: request.path
  };
  return models.Server.findById(serverId)
    .then((server) => reply(jsonutils.formatResponse(urls, server)).code(!server ? 404 : 200));
};

exports.modifyServer = function (request, reply) {
  const serverId = request.params.id;
  const parameters = request.query;
  const urls = {
    self: request.path
  };
  models.Server.findById(serverId)
    .then((server) => {
      if (server) {
        server.updateAttributes(parameters)
          .then((data) => reply.redirect('/servers/' + data.id))
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
