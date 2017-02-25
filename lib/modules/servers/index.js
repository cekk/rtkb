const routes = require('./routes');
const Joi = require('joi');

exports.register = function (server, options, next) {

  server.route({
    path: '/',
    method: 'GET',
    handler: routes.home,
    config: {
        description: 'Show managed servers',
        notes: 'It\'s a list of managed servers by RedTurtle',
        tags: ['api']
    }
  });

  server.route({
    path: '/',
    method: 'POST',
    handler: routes.addServer,
    config: {
        description: 'Add a new server',
        notes: 'Creates a new server with given parameters',
        tags: ['api'],
        validate: {
            query: {
                name: Joi.string().required(),
                ip: Joi.string().ip().required(),
            }
        }
    }
  });

  server.route({
    path: '/{id}',
    method: 'GET',
    handler: routes.serverDetails,
    config: {
        description: 'Show server details',
        notes: 'Show server details',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
  });

  server.route({
    path: '/{id}/delete',
    method: 'GET',
    handler: routes.deleteServer,
    config: {
        description: 'Show server details',
        notes: 'Show server details',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
  });

  server.route({
    path: '/{id}/edit',
    method: 'PUT',
    handler: routes.modifyServer,
    config: {
        description: 'Edit server informations',
        // notes: '',
        tags: ['api'],
        validate: {
          query: {
            id: Joi.string().required(),
            name: Joi.string().required(),
            ip: Joi.string().ip().required(),
            commonName: Joi.string(),
            dataCenterName: Joi.string()
          }
        }
    }
  });
  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
};
