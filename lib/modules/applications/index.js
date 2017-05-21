const routes = require('./routes');
const Joi = require('joi');

exports.register = function (application, options, next) {

  application.route({
    path: '/',
    method: 'GET',
    handler: routes.home,
    config: {
        description: 'Show managed applications',
        notes: 'It\'s a list of managed applications by RedTurtle',
        tags: ['api']
    }
  });

  application.route({
    path: '/',
    method: 'POST',
    handler: routes.addApplication,
    config: {
        description: 'Add a new application',
        notes: 'Creates a new application with given parameters',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
          payload: {
            name: Joi.string().required(),
            description: Joi.string(),
            infos: Joi.string(),
            buildoutRepository: Joi.string().uri({
              scheme: [
                'git',
                /git\+https?/
              ]
            }),
            ServerId: Joi.number().integer(),
            secrets: Joi.any(),
            responsibles: Joi.array(),
          }
        }
    }
  });

  application.route({
    path: '/{id}',
    method: 'GET',
    handler: routes.applicationDetails,
    config: {
        description: 'Show application details',
        notes: 'Show application details',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
  });

  application.route({
    path: '/{id}',
    method: 'DELETE',
    handler: routes.deleteApplication,
    config: {
        description: 'Show application details',
        notes: 'Show application details',
        tags: ['api'],
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    }
  });

  application.route({
    path: '/{id}/edit',
    method: 'PUT',
    handler: routes.modifyApplication,
    config: {
        description: 'Edit application informations',
        // notes: '',
        tags: ['api'],
        validate: {
          query: {
            name: Joi.string().required(),
            description: Joi.string(),
            infos: Joi.string(),
            buildoutRepository: Joi.string().uri({
              scheme: [
                'git',
                /git\+https?/
              ]
            }),
            secrets: Joi.any(),
            responsibles: Joi.array(),
          }
        }
    }
  });
  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
};
