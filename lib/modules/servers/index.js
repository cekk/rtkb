const routes = require('./routes');
const Joi = require('joi');

exports.register = function (server, options, next) {

  server.route({
    path: '/',
    method: 'GET',
    handler: routes.home,
    config: {
        description: 'Show managed Servers',
        notes: 'It\'s a list of managed servers by RedTurtle',
        tags: ['api']
    }
  });

  // server.route({
  //   path: '/hello/{user?}',
  //   method: 'GET',
  //   handler: routes.hello,
  //   config: {
  //       description: 'Say hello!',
  //       notes: 'The user parameter defaults to \'stranger\' if unspecified',
  //       tags: ['api', 'greeting'],
  //       validate: {
  //           params: {
  //               user: Joi.string().min(5).max(10)
  //           }
  //       }
  //   }
  // });

  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
};
