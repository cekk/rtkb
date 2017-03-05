/* global describe, beforeEach, before, it, expect, db, server */

describe('Routes /servers', () => {
  let token;
  // before((done) => {
  //     let options = {
  //       method: 'GET',
  //       url: '/servers',
  //     };
  //
  //     server.inject(options, (response) => {
  //       token = response.result.token;
  //       done();
  //     });
  // });
  describe('GET /servers', () => {
    it('return 200 HTTP status code', (done) => {
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
});
