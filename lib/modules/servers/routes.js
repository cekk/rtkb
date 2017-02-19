const Server = require('./models').Server;

exports.home = function (request, reply) {
  Server.find(function (err, servers) {
    if (err) return console.error(err);
    reply(servers);
  });

};


exports.hello = function (request, reply) {
  const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
  reply('Hello ' + user + '!');
};
