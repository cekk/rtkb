const config = require('../../../config/settings');
const models = require('../../models');
const LabbableApplication = require('../../../app.js');
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

// console.log("##########################");
// console.log(response);
// console.log("##########################");

describe('Routes /applications', () => {
  let token;

  before((done) => {
    LabbableApplication.ready((err, app) => {
        if (err) {
            return done(err);
        }
        application = app;
        models.sequelize.sync({ force : true }) // drops table and re-creates it
          .then(() => done(null))
          .catch(err => done(err));
    });
  });

  describe('GET /applications empty', () => {
    it('return an empty list', (done) => {
      let options = {
        method: 'GET',
        url: '/applications',
      };
      application.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data).to.be.empty;
        done();
      });
    });
  });

  describe('Populate applications list and get a list', () => {

    after((done) => {
      models.Application.sync({ force : true }) // drops table and re-creates it
        .then(function() {
          done(null);
        });
    });

    const application1 = {
      method: 'POST',
      url: '/applications',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      payload: {
        name: 'First application',
        description: 'my first application'
      }
    };

    it('can create a new application with POST call', (done) => {
      application.inject(application1, (response) => {
        expect(response).to.have.property('result');
        expect(response.statusCode).to.equal(201);
        expect(response.result.data).to.not.be.empty;
        expect(response.result.data.name).to.equal(application1.payload.name);
        done();
      });
    });

    it('can\'t create two applications with the same name', (done) => {
      application.inject(application1, (response) => {
        expect(response).to.have.property('result');
        expect(response.statusCode).to.equal(500);
        expect(response.result.errors).to.not.be.empty;
        expect(response.result.data).to.be.undefined;
        expect(response.result.errors[0].title).to.equal('name must be unique');
        done();
      });
    });

    it('GET /applications now return a list with 1 application', (done) => {
      let options = {
        method: 'GET',
        url: '/applications',
      };

      application.inject(options, (response) => {
        expect(response).to.have.property('result');;
        expect(response.result.data.length).to.equal(1);
        expect(response.result.data[0].name).to.equal(application1.payload.name);
        done();
      });
    });

  });

  describe('GET /applications list with multiple entries (4)', () => {

    before((done) => {
      const applications = [1,2,3,4].map((x) => {
        return {
          name: `application${x}`,
          description: `my application number ${x}`
        };
      });

      models.Application.bulkCreate(applications)
        .then(function() {
          return done();
        });
    });

    after((done) => {
      models.Application.sync({ force : true }) // drops table and re-creates it
        .then(function() {
          done(null);
        });
    });

    it('return a list of 4 applications', (done) => {
      let options = {
        method: 'GET',
        url: '/applications',
      };

      application.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data.length).to.equal(4);
        done();
      });
    });
  });

  describe('GET /applications associate Application to a Server', () => {
    let serverId = null;
    before((done) => {
      models.Server.create({name: 'Server 1'})
        .then(function(server) {
          serverId = server.id;
          return done();
        });
    });

    after((done) => {
      models.sequelize.sync({ force : true }) // drops table and re-creates it
        .then(function() {
          done(null);
        });
    });

    it('associate Application to Server 1', (done) => {
      const application1 = {
        method: 'POST',
        url: '/applications',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        payload: {
          name: 'First application',
          description: 'my first application',
          ServerId: serverId,
        }
      };

      application.inject(application1, (response) => {
        expect(response).to.have.property('result');
        expect(response.statusCode).to.equal(201);
        expect(response.result.data).to.not.be.empty;
        expect(response.result.data.name).to.equal(application1.payload.name);
        models.Server.findById(serverId).then((server) => {
          server.getApplications().then((applications) => {
            expect(applications.length).to.equal(1);
            done();
          })
        });
      });
    });
  });

  describe('Delete a application', () => {

    before((done) => {
      const applications = [1,2,3,4].map((x) => {
        return {
          name: `application${x}`,
          commonName: `application ${x}`,
          ip: `127.0.0.${x}`,
          dataCenterName: `datacenter ${x}`,
          description: `my application number ${x}`
        };
      });

      models.Application.bulkCreate(applications)
        .then(function() {
          return done();
        });
    });

    it('delete a application by its id', (done) => {
      let options = {
        method: 'GET',
        url: '/applications',
      };

      application.inject(options, (response) => {
        const applicationId = response.result.data[0].id;
        const deleteOptions = {
          method: 'DELETE',
          url: `/applications/${applicationId}`,
        };
        application.inject(deleteOptions, (response) => {
          expect(response).to.have.property('result');
          expect(response.statusCode).to.equal(200);
          return done();
        });
      });
    });

    it('now there are 3 applications', (done) => {
      let options = {
        method: 'GET',
        url: '/applications',
      };

      application.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data.length).to.equal(3);
        return done();
      });
    });
  });
});
