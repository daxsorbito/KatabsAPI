
'use strict';
var supertest = require('co-supertest');
var app = require('../app');

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
        var data = {
          "email": "dax.sorbito@email.com",
          "user_name": "dax.sorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
         };

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
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
      var data = {
        "email": "dax.sorbito@email.com",
        "user_name": "dax.a.sorbito",
        "password": "pass",
        "first_name": "dax",
        "last_name": "sorbito",
        "address1": "cebu city",
        "zip_code": 6000,
        "user_type": 1
      };
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        done();
      });

      it('should return 200 with searched data', function *(done){
        let result = yield supertest(this.server)
          .get('/v1/users?find={"user_name":"'+ data.user_name +'"}')
          .set({'Content-Type':'application/json'})
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
      var data = {
        "email": "dax.sorbito@email.com",
        "user_name": "michele.sorbito",
        "password": "pass",
        "first_name": "dax",
        "last_name": "sorbito",
        "address1": "cebu city",
        "zip_code": 6000,
        "user_type": 1
      };
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
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
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body.user_name.should.equal(data.user_name);
        done();
      });
    });

    describe('DEL /v1/users/:id', function(){
      var addedData = {};
      var data = {
        "email": "dax.sorbito@email.com",
        "user_name": "tobeDeleted",
        "password": "pass",
        "first_name": "dax",
        "last_name": "sorbito",
        "address1": "cebu city",
        "zip_code": 6000,
        "user_type": 1
      };
      before(function *(done){
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
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
        var data = {
          "email": "dax.sorbito@email.com",
          "user_name": "daxsorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end();

        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with the updated data using _id', function *(done){
        var data = {
          "email": "michele.sorbito@email.com",
          "user_name": "michelesorbito",
          "password": "pass",
          "first_name": "michele",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };
        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(200);
        result.body._id.should.equal(addedData._id);
        result.body.user_name.should.equal(data.user_name);
        result.body.password.should.not.equal(addedData.password);
        done();
      });
    });

    describe('POST /v1/users/:id', function(){
      var addedData = {};
      before(function *(done){
        var data = {
          "email": "dax.sorbito@email.com",
          "user_name": "daxsorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };
        this.server = app.listen();
        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(201);
        addedData = result.body;
        done();
      });

      it('should return 200 with the updated data using _id', function *(done){
        var data = {
          "email": "michele.sorbito@email.com",
          "user_name": "michelesorbito",
          "password": "pass",
          "first_name": "michele",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };
        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
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
    beforeEach(function(){
      this.server = app.listen();
    });
    afterEach(function *(){
      yield this.server.close.bind(this.server);
    });

    describe('POST /v1/users', function() {
      it('should return 400 - "Invalid email"', function *(done){
        var data = {
          "email": "dax.sorbito.com",
          "user_name": "dax.sorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };

        let result = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
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
        var addedData = {
          "email": "dax.sorbito@email.com",
          "user_name": "daxsorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };

        let result1 = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(addedData)
          .expect(201)
          .end();

        result1.statusCode.should.equal(201);
        addedData = result1.body;

        var invalidData = {
          "email": "dax.sorbito.com",
          "user_name": "dax.sorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };

        let result = yield supertest(this.server)
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
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
        var addedData = {
          "email": "dax.sorbito@email.com",
          "user_name": "daxsorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };

        let result1 = yield supertest(this.server)
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .expect(201)
          .send(addedData)
          .end();
        result1.statusCode.should.equal(201);
        addedData = result1.body;

        var invalidData = {
          "email": "dax.sorbito.com",
          "user_name": "dax.sorbito",
          "password": "pass",
          "first_name": "dax",
          "last_name": "sorbito",
          "address1": "cebu city",
          "zip_code": 6000,
          "user_type": 1
        };

        let result = yield supertest(this.server)
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(invalidData)
          .expect(400)
          .end();

        result.headers["content-type"].should.equal("application/json; charset=utf-8");
        result.statusCode.should.equal(400);
        done();
      });
    });
  });
});
