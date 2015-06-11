
'use strict';
var shortid = require('shortid');
var supertest = require('co-supertest');
var app = require('../app');

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

describe('Users', function() {
  beforeEach(function(){
    this.server = app.listen();
  });
  afterEach(function *(){
    yield this.server.close.bind(this.server);
  });

  describe('Default users schema routes', function() {
    describe('POST /v1/users', function() {
      it('should return 201 - "Created" status', function *(done) {
        var data = getTestData();

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        // expect password has been hashed
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        result.body.password.should.not.equal(data.password);
        done();
      });
    });

    describe('GET /v1/users - find "name"', function() {
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        done();
      });

      it('should return 200 with searched data', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users?find={"user_name":"'+ data.user_name +'"}')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body.should.be.a.Array;
        result.body[0].user_name.should.equal(data.user_name);
        done();
      });
    });

    describe('GET /v1/users/:id', function(){
      var addedData = {};
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with searched data using _id', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body.user_name.should.equal(data.user_name);
        done();
      });
    });

    describe('DEL /v1/users/:id', function(){
      var addedData = {};
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with deleted data using _id', function *(done){
        let result = yield supertest(this.server)
          .del('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body.user_name.should.equal(data.user_name);
        done();
      });
    });

    describe('PUT /v1/users/:id', function(){
      var addedData = {};
      before(function *(done){
        var data = getTestData();
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with the updated data using _id', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body._id.should.equal(addedData._id);
        result.body.user_name.should.equal(data.user_name);
        result.body.user_name.should.not.equal(addedData.user_name);
        result.body.password.should.not.equal(addedData.password);
        done();
      });
    });

    describe('POST /v1/users/:id', function(){
      var addedData = {};
      before(function *(done){
        var data = getTestData();
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with the updated data using _id', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body._id.should.equal(addedData._id);
        result.body.user_name.should.equal(data.user_name);
        result.body.password.should.not.equal(data.password);

        done();
      });
    });
  });

  describe('Validation routes test', function() {

    describe('POST /v1/users', function() {
      it('should return 400 - "Invalid email"', function *(done){
        var data = getTestData();
        data.email = "invalid_email_address";
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .expect(400)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(400);
        done();
      });
    });

    describe('PUT /v1/users/:id', function(){
      it('should return 400 - "Invalid email"', function *(done){
        var addedData = getTestData();

        let result1 = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(addedData)
          .expect(201)
          .end();

        result1.statusCode.should.equal(201);
        addedData = result1.body;

        var invalidData = getTestData();
        invalidData.email = "invalid_email_address";

        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(invalidData)
          .expect(400)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(400);
        done();
      });
    });

    describe('POST /v1/users/:id', function(){
      it('should return 400 - "Invalid email"', function *(done){
        var addedData = getTestData();

        let result1 = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .expect(201)
          .send(addedData)
          .end();
        result1.statusCode.should.equal(201);
        addedData = result1.body;

        var invalidData = getTestData();
        invalidData.email = "invalid_email_address";

        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(invalidData)
          .expect(400)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(400);
        done();
      });
    });
  });

  describe('Validate authentication on routes', function(){

    describe('POST /v1/users', function(){
      it('should not access POST /v1/users if header credentials are not supplied', function *(done) {
        var data = getTestData();

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type': 'application/json'})
          .send(data)
          .expect(403)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
      it('should not access POST /v1/users if header credentials are invalid', function *(done) {
        var data = getTestData();

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type': 'application/json'})
          .set(getSecurityHeaders(true))
          .send(data)
          .expect(403)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
    });

    describe('GET /v1/users - find "name"', function() {
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();
        result.statusCode.should.equal(201);
        done();
      });

      it('should not access GET /v1/users=find{} if header credentials are not supplied', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users?find={"user_name":"'+ data.user_name +'"}')
          .set({'Content-Type':'application/json'})
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });

      it('should not access GET /v1/users=find{} if header credentials are invalid', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users?find={"user_name":"'+ data.user_name +'"}')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders(true))
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
    });

    describe('GET /v1/users/:id', function(){
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();
        result.statusCode.should.equal(201);
        data = result.body;
        done();
      });
      it('should not access GET /v1/users/:id if header credentials are not supplied', function *(done) {
        let result = yield supertest(this.server)
          .get('/v1/users/'+ data._id)
          .set({'Content-Type':'application/json'})
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
      it('should not access GET /v1/users/:id if header credentials are invalid', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users/'+ data._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders(true))
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
    });

    describe('DEL /v1/users/:id', function(){
      var data = getTestData();
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        data = result.body;
        done();
      });

      it('should not access DEL /v1/users/:id if header credentials are not supplied', function *(done){
        let result = yield supertest(this.server)
          .del('/v1/users/'+ data._id)
          .set({'Content-Type':'application/json'})
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
      it('should not access DEL /v1/users/:id if header credentials are invalid', function *(done){
        let result = yield supertest(this.server)
          .del('/v1/users/'+ data._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders(true))
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
    });

    describe('PUT /v1/users/:id', function(){
      var addedData = {};
      before(function *(done){
        addedData = getTestData();
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(addedData)
          .end();

        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should not access PUT /v1/users/:id if header credentials are not supplied', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
      it('should not access PUT /v1/users/:id if header credentials are invalid', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .set(getSecurityHeaders(true))
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });
    });
    describe('POST /v1/users/:id', function(){
      var addedData = {};
      before(function *(done){
        var data = getTestData();
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders())
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should not access PUT /v1/users/:id if header credentials are not supplied', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });

      it('should not access PUT /v1/users/:id if header credentials are invalid', function *(done){
        var data = getTestData();
        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .set(getSecurityHeaders(true))
          .send(data)
          .expect(403)
          .end();
        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(403);
        result.body.should.have.property('error');
        done();
      });

    });
  });
});
