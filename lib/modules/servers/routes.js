const Server = require('./models').Server;
const jsonutils = require('../../utils/jsonutils');
const util = require('util');

exports.home = function (request, reply) {
  Server.find().exec()
    .then((servers) => reply(jsonutils.formatResponse(request, servers)))
    .catch(err => {
      console.trace(error);
      return reply({
        'status': 500,
        'error': "ciao"
      });
  });
};

exports.addServer = function (request, reply) {
  const parameters = request.payload;
  const newServer = new Server(parameters);
  newServer.save()
    .then((data) => {
      const urls = {
        self: '/servers/' + data._id
      };
      return reply(jsonutils.formatResponse(urls, data)).code(201);
    })
    .catch((err) => {
      const parsedError = jsonutils.parseError(err);
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
  const urls = {
    self: request.path
  };
  if (serverId.match(/^[0-9a-fA-F]{24}$/)) {
    // is a valid mongodb id
    return Server.findByIdAndRemove(serverId).exec()
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
  }
  else {
    return reply(jsonutils.formatErrorResponse(urls, {
      code: 404,
      message: util.format('Server with id "%s" not found in the db.', serverId),
      detail: ''
    })).code(404);
  }
};

exports.serverDetails = function (request, reply) {
  const serverId = request.params.id;
  const urls = {
    self: request.path
  };
  if (serverId.match(/^[0-9a-fA-F]{24}$/)) {
    // is a valid mongodb id
    return Server.findOne({_id: serverId}).exec()
      .then((server) => reply(jsonutils.formatResponse(urls, server)).code(!server ? 404 : 200));
  }
  else {
    return reply(jsonutils.formatResponse(urls, null)).code(404);
  }
};

exports.modifyServer = function (request, reply) {
  const serverId = request.params.id;
  const parameters = request.query;
  const urls = {
    self: request.path
  };
  Server.findOneAndUpdate({_id: serverId}, parameters, {upsert: true})
    .then((data) => reply.redirect('/servers/' + data._id))
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
