'use strict';
var shortid = require('shortid');
var supertest = require('supertest');
var app = require('../app');
var config = require('../config');
var redisStore = require('../lib/db/redisStore')().connect();

var getTestData = function() {
  var shortId = shortid.generate();
  return  {
    "email": shortId + "@logintest.com",
    "user_name": "dax." + shortId,
    "password": "pass" + shortId,
    "first_name": "dax_" + shortId,
    "last_name": shortId,
    "address1": "cebu city" + shortId,
    "zip_code": 6000,
    "user_type": 1
  };
};

var getSecurityHeaders = function(inValid) {
  return {
    "KTB-Token": inValid ? "invalid" : "$2a$10$6TPPFv65FRf2p9uFJjYyhOZpbHfNT3qKpyM9waJJ5RpvNzZCYlyBS",
    "KTB-Username": inValid ? "invalid" : "dax.testAdmin.sorbito"
  };
};

describe('Auth', function() {
  beforeEach(function(){
    this.server = app.listen();
  });
  afterEach(function *(){
    yield this.server.close.bind(this.server);
  });
  describe('Login', function() {
    describe('POST auth/login', function(){
      it('should be able to login with proper credentials', function *(done){
        var data = getTestData();

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        result.body.password.should.not.equal(data.password);

        let result2 = yield supertest(this.server)
          .post('/v1/auth/login')
          .set({'Content-Type': 'application/json'})
          .send({"user_name": data.user_name, "password": data.password})
          .end();

        result2.header["content-type"].should.equal("application/json; charset=utf-8");
        result2.statusCode.should.equal(201);

        var token = yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name);
        token.should.not.empty;
        done();
    });

      it('should not be able to login with a different credentials', function *(done){
        var data = getTestData();

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        result.body.password.should.not.equal(data.password);

        let result2 = yield supertest(this.server)
          .post('/v1/auth/login')
          .set({'Content-Type': 'application/json'})
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

    describe('POST auth/logout', function(){
      it('should be able to logout', function *(done){
        var data = getTestData();

        let createReq = yield supertest(this.server)
            .post('/v1/users')
            .set({'Content-Type':'application/json'})
            .set(getSecurityHeaders())
            .expect(201)
            .send(data)
            .end();
        createReq.headers["content-type"].should.equal("application/json; charset=utf-8");
        createReq.statusCode.should.equal(201);
        createReq.body.password.should.not.equal(data.password);

        let loginReq = yield supertest(this.server)
            .post('/v1/auth/login')
            .set({'Content-Type': 'application/json'})
            .send({"user_name": data.user_name, "password": data.password})
            .end();
        loginReq.header["content-type"].should.equal("application/json; charset=utf-8");
        loginReq.statusCode.should.equal(201);

        var loginToken = yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name);
        loginToken.should.not.empty;
        this.server = null;
        this.server = app.listen();
        let logoutReq = yield supertest(this.server)
            .post('/v1/auth/logout')
            .set({'Content-Type': 'application/json'})
            .set({ "KTB-Username": data.user_name })
            .send({})
            .expect(200)
            .end();
        logoutReq.header["content-type"].should.equal("application/json; charset=utf-8");
        logoutReq.statusCode.should.equal(200);
        var removedToken = (yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name)) || 'NO_TOKEN';
        removedToken.should.equal('NO_TOKEN');

        done();
      });
    });

    describe('POST auth/resetpassword', function(){
      it('should be able to resetpassword', function *(done){
        var data = getTestData();

        let createReq = yield supertest(this.server)
            .post('/v1/users')
            .set({'Content-Type':'application/json'})
            .set(getSecurityHeaders())
            .expect(201)
            .send(data)
            .end();
        createReq.headers["content-type"].should.equal("application/json; charset=utf-8");
        createReq.statusCode.should.equal(201);
        createReq.body.password.should.not.equal(data.password);

        let loginReq = yield supertest(this.server)
            .post('/v1/auth/login')
            .set({'Content-Type': 'application/json'})
            .send({"user_name": data.user_name, "password": data.password})
            .end();
        loginReq.header["content-type"].should.equal("application/json; charset=utf-8");
        loginReq.statusCode.should.equal(201);

        var loginToken = yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name);
        loginToken.should.not.empty;
        this.server = null;
        this.server = app.listen();
        let logoutReq = yield supertest(this.server)
            .post('/v1/auth/logout')
            .set({'Content-Type': 'application/json'})
            .set({ "KTB-Username": data.user_name })
            .send({})
            .expect(200)
            .end();
        logoutReq.header["content-type"].should.equal("application/json; charset=utf-8");
        logoutReq.statusCode.should.equal(200);
        var removedToken = (yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + data.user_name)) || 'NO_TOKEN';
        removedToken.should.equal('NO_TOKEN');

        done();
      });
    });
  });
});
