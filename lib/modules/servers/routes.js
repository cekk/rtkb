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
  const parameters = request.query;
  const newServer = new Server(parameters);
  newServer.save()
    .then((data) => reply.redirect('/servers/' + data._id))
    .catch((err) => {
      const parsedError = jsonutils.parseError(err);
      return reply(jsonutils.formatErrorResponse(request, {
        code: 500,
        message: parsedError.message,
        detail: parsedError.detail
      })).code(500);
    });
};

exports.deleteServer = function (request, reply) {
  const serverId = request.params.id;
  if (serverId.match(/^[0-9a-fA-F]{24}$/)) {
    // is a valid mongodb id
    return Server.findByIdAndRemove(serverId).exec()
      .then(() => reply.redirect('/servers'))
      .catch((err) => {
        console.trace(err);
        const parsedError = jsonutils.parseError(err);
        return reply(jsonutils.formatErrorResponse(request, {
          code: 500,
          message: parsedError.message,
          detail: parsedError.detail
        })).code(500);
      });
  }
  else {
    return reply(jsonutils.formatErrorResponse(request, {
      code: 404,
      message: util.format('Server with id "%s" not found in the db.', serverId),
      detail: ''
    })).code(404);
  }
};

exports.serverDetails = function (request, reply) {
  const serverId = request.params.id;
  if (serverId.match(/^[0-9a-fA-F]{24}$/)) {
    // is a valid mongodb id
    return Server.findOne({_id: serverId}).exec()
      .then((server) => reply(jsonutils.formatResponse(request, server)).code(!server ? 404 : 200));
  }
  else {
    return reply(jsonutils.formatResponse(request, null)).code(404);
  }
};

exports.modifyServer = function (request, reply) {
  const serverId = request.params.id;
  // const serverId = '58b1c927578d4c18523b27cb';
  const parameters = request.query;
  Server.findOneAndUpdate({_id: serverId}, parameters, {upsert: true})
    .then((data) => reply.redirect('/servers/' + data._id))
    .catch((err) => {
      console.trace(err);
      const parsedError = jsonutils.parseError(err);
      return reply(jsonutils.formatErrorResponse(request, {
        code: 500,
        message: parsedError.message,
        detail: parsedError.detail
      })).code(500);
    });
};
