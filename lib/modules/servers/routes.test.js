const config = require('../../../config/settings');
const models = require('../../models');
const LabbableServer = require('../../../app.js');
const expect = require('chai').expect;

let lab = exports.lab = require('lab').script();

// prepare environment
const it = lab.it;
const iit = lab.iit;
const describe = lab.describe;
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;

let server;

// console.log("##########################");
// console.log(response);
// console.log("##########################");

describe('Routes /servers', () => {
  let token;

  before((done) => {
    LabbableServer.ready((err, srv) => {
        if (err) {
            return done(err);
        }
        server = srv;
        models.sequelize.sync({ force : true }) // drops table and re-creates it
          .then(() => done(null))
          .catch(err => done(error));
    });
  });

  describe('GET /servers empty', () => {
    it('return an empty list', (done) => {
      let options = {
        method: 'GET',
        url: '/servers',
      };
      server.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data).to.be.empty;
        done();
      });
    });
  });

  describe('Populate servers list and get a list', () => {

    after((done) => {
      models.Server.sync({ force : true }) // drops table and re-creates it
        .then(function() {
          done(null);
        });
    });

    const server1 = {
      method: 'POST',
      url: '/servers',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      payload: {
        name: 'server1',
        commonName: 'first server',
        ip: '127.0.0.1',
        dataCenterName: 'datacenter 1',
        description: 'my first server'
      }
    };

    it('can create a new server with POST call', (done) => {
      server.inject(server1, (response) => {
        expect(response).to.have.property('result');
        expect(response.statusCode).to.equal(201);
        expect(response.result.data).to.not.be.empty;
        expect(response.result.data.name).to.equal(server1.payload.name);
        done();
      });
    });

    it('can\'t create two servers with the same name and ip', (done) => {
      server.inject(server1, (response) => {
        expect(response).to.have.property('result');
        expect(response.statusCode).to.equal(500);
        expect(response.result.errors).to.not.be.empty;
        expect(response.result.data).to.be.undefined;
        expect(response.result.errors[0].title).to.equal('name must be unique');
        done();
      });
    });

    it('GET /servers now return a list with 1 server', (done) => {
      let options = {
        method: 'GET',
        url: '/servers',
      };

      server.inject(options, (response) => {
        expect(response).to.have.property('result');;
        expect(response.result.data.length).to.equal(1);
        expect(response.result.data[0].name).to.equal(server1.payload.name);
        done();
      });
    });
  });

  describe('GET /servers list with multiple entries (4)', () => {

    before((done) => {
      const servers = [1,2,3,4].map((x) => {
        return {
          name: `server${x}`,
          commonName: `server ${x}`,
          ip: `127.0.0.${x}`,
          dataCenterName: `datacenter ${x}`,
          description: `my server number ${x}`
        };
      });

      models.Server.bulkCreate(servers)
        .then(function() {
          return done();
        });
    });

    after((done) => {
      models.Server.sync({ force : true }) // drops table and re-creates it
        .then(function() {
          done(null);
        });
    });

    it('return a list of 4 servers', (done) => {
      let options = {
        method: 'GET',
        url: '/servers',
      };

      server.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data.length).to.equal(4);
        done();
      });
    });
  });

  describe('Delete a server', () => {

    before((done) => {
      const servers = [1,2,3,4].map((x) => {
        return {
          name: `server${x}`,
          commonName: `server ${x}`,
          ip: `127.0.0.${x}`,
          dataCenterName: `datacenter ${x}`,
          description: `my server number ${x}`
        };
      });

      models.Server.bulkCreate(servers)
        .then(function() {
          return done();
        });
    });

    it('delete a server by its id', (done) => {
      let options = {
        method: 'GET',
        url: '/servers',
      };

      server.inject(options, (response) => {
        const serverId = response.result.data[0].id;
        const deleteOptions = {
          method: 'DELETE',
          url: `/servers/${serverId}`,
        };
        server.inject(deleteOptions, (response) => {
          expect(response).to.have.property('result');
          expect(response.statusCode).to.equal(200);
          return done();
        });
      });
    });

    it('now there are 3 servers', (done) => {
      let options = {
        method: 'GET',
        url: '/servers',
      };

      server.inject(options, (response) => {
        expect(response).to.have.property('result');
        expect(response.result.data.length).to.equal(3);
        return done();
      });
    });
  });
});
