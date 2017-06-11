const config = require('../../config/settings');
const models = require('./index');
const LabbableApplication = require('../../app.js');
const expect = require('chai').expect;

let lab = exports.lab = require('lab').script();

// prepare environment
const it = lab.it;
const iit = lab.iit;
const describe = lab.describe;
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;

let application;

describe('Applications: models', () => {
  before((done) => {
    models.sequelize.sync({ force : true }) // drops table and re-creates it
      .then(() => done(null))
      .catch(err => done(err));
  });

  describe('Hash secrets', function () {
    it('secrets should be stored hashed', function (done) {
      const parameters = {
        name: 'First application',
        description: 'my first application',
        secrets: '[{"username": "admin", "password": "secret"}]'
      };

      models.Application.create(parameters)
        .then((application) => {
          expect(application.secrets).not.to.equal(parameters.secrets);
          expect(application.decryptSecrets(application.secrets)).to.equal(parameters.secrets);
          return done();
        });
    });
    it('with decryptSecrets method, we should decrypt hashed secrets', function (done) {
      const parameters = {
        name: 'Another application',
        description: 'my second application',
        secrets: '[{"username": "admin", "password": "secret"}]'
      };
      models.Application.create(parameters)
        .then((application) => {
          expect(application.decryptSecrets(application.get('secrets'))).to.equal(parameters.secrets);
          return done();
        });
    });
  });
});
