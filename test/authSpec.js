'use strict';
var shortid = require('shortid');
var superagent = require('supertest');
var expect = require('expect.js') // may be change to chai
var app = require('../app');

function request() {
  return superagent(app.listen());
}

describe('Auth', function() {
  var shortId;
  before(function(){
    shortId = shortid.generate();
  });
  describe('Login', function() {
    describe('POST auth/login', function(){
      it('should be able to login with proper credentials', function(done){
        var data = {
          "email": shortId + "@logintest.com",
          "user_name": "dax.sorbito" + shortId,
          "password": "pass" + shortId,
          "first_name": "dax" + shortId,
          "last_name": "sorbito" + shortId,
          "address1": "cebu city" + shortId,
          "zip_code": 6000,
          "user_type": 1
        };

        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body.password).not.to.equal(data.password);
            request()
              .post('/v1/auth/login')
              .set({'Content-Type': 'application/json'})
              .send({"user_name": data.user_name, "password": data.password})
              .end(function(err, result){
                //console.log(result)
                expect(result.header["content-type"]).to.equal("application/json; charset=utf-8");
                expect(result.statusCode).to.equal(201);
                expect(result.body.token).to.not.be.empty();
                done();
              });
          });
      });
    });
  });
});
