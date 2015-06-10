'use strict';
var shortid = require('shortid');
var supertest = require('supertest');
var app = require('../app');
var config = require('../config');
var redisStore = require('../lib/db/redisStore')().connect();

function request() {
  return superagent(app.listen());
}

describe('Auth', function() {
  var shortId;
  beforeEach(function(){
    shortId = shortid.generate();
    this.server = app.listen();
  });
  afterEach(function *(){
    yield this.server.close.bind(this.server);
  });
  describe('Login', function() {
    describe('POST auth/login', function(){
      it('should be able to login with proper credentials', function *(done){
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

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set({
            "KTB-Token": "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS",
            "KTB-Username": "dax.testAdmin.sorbito"})
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        result.body.password.should.not.equal(data.password);

        let result2 = yield supertest(this.server)
          .post('/v1/auth/login')
          .set({'Content-Type': 'application/json'})
          .set({
            "KTB-Token": "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS",
            "KTB-Username": "dax.testAdmin.sorbito"})
          .send({"user_name": data.user_name, "password": data.password})
          .end();

        result2.header["content-type"].should.equal("application/json; charset=utf-8");
        result2.statusCode.should.equal(201);

        var token = yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name);
        token.should.not.empty;
        done();
    });

      it('should not be able to login with a different credentials', function *(done){
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

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set({
            "KTB-Token": "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS",
            "KTB-Username": "dax.testAdmin.sorbito"})
          .send(data)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        result.body.password.should.not.equal(data.password);

        let result2 = yield supertest(this.server)
          .post('/v1/auth/login')
          .set({'Content-Type': 'application/json'})
          .set({
            "KTB-Token": "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS",
            "KTB-Username": "dax.testAdmin.sorbito"})
          .send({"user_name": data.user_name, "password": 'InValidPassword'})
          .expect(403)
          .end();
        result2.header["content-type"].should.equal("application/json; charset=utf-8");
        result2.statusCode.should.equal(403);
        result2.body.should.not.have.property('token');
        result2.body.should.have.property('error');
        done();
      });
    });
  });

});
