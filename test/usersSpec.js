/*global describe, it*/
'use strict';
var superagent = require('supertest');
var expect = require('expect.js') // may be change to chai
var app = require('../app');

function request() {
  return superagent(app.listen());
}

describe('Routes', function() {
  describe('Default users schema routes', function() {
    describe('POST /v1/users', function() {
      it('should return 201 - "Created" status', function(done) {
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

        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            // expect password has been hashed
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body.password).not.to.equal(data.password);
            done();
          });
      });

      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

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
      before(function(done){
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .expect('Content-Type', /application\/json/)
          .expect(201,done)
      });

      it('should return 200 with searched data', function(done){
        request()
          .get('/v1/users?find={"user_name":"'+ data.user_name +'"}')
          .set({'Content-Type':'application/json'})
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('array');
            expect(result.body).to.not.be.empty();
            expect(result.body[0].user_name).to.be.eql(data.user_name);
            done();
          })
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
      before(function(done){
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });
      it('should return 200 with searched data using _id', function(done){
        request()
          .get('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.empty();
            expect(result.body.user_name).to.be.eql(data.user_name);
            done();
          })
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
      before(function(done){
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });
      it('should return 200 with deleted data using _id', function(done){
        request()
          .del('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.empty();
            expect(result.body.user_name).to.be.eql(data.user_name);
            done();
          })
      });
    });

    describe('PUT /v1/users/:id', function(){
      var addedData = {};

      before(function(done){
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
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });
      it('should return 200 with the updated data using _id', function(done){
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
        request()
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.empty();
            expect(result.body._id).to.be.eql(addedData._id);
            expect(result.body.user_name).to.be.eql(data.user_name);
            expect(result.body.password).not.to.equal(data.password);

            done();
          });
      });

      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

      });
    });

    describe('POST /v1/users/:id', function(){
      var addedData = {};

      before(function(done){
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
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });
      it('should return 200 with the updated data using _id', function(done){
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
        request()
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.empty();
            expect(result.body._id).to.be.eql(addedData._id);
            expect(result.body.user_name).to.be.eql(data.user_name);
            expect(result.body.password).not.to.equal(data.password);

            done();
          });
      });

      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

      });
    });
  });
  describe('Validation routes test', function() {
    describe('POST /v1/users', function() {
      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

      });
    });

    describe('PUT /v1/users/:id', function(){
      var addedData = {};

      before(function(done){
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
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });

      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .put('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

      });
    });

    describe('POST /v1/users/:id', function(){
      var addedData = {};

      before(function(done){
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
        request()
          .post('/v1/users')
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.not.be.empty();
            addedData = result.body;
            done();
          })
      });

      it('should return 400 - "Invalid email"', function(done){
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

        request()
          .post('/v1/users/'+ addedData._id)
          .set({'Content-Type':'application/json'})
          .send(data)
          .end(function(err, result) {
            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
            expect(result.statusCode).to.equal(400);
            done();
          });

      });
    });
  });
});
