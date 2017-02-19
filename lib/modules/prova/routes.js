exports.home = function (request, reply) {
  reply({
    aaa: 1,
    bbb: 2
  });
};


exports.hello = function (request, reply) {
  const user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
  reply('Hello ' + user + '!');
};
