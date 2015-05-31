/*global describe, it*/
'use strict';
var superagent = require('supertest');
var expect = require('expect.js') // may be change to chai
var app = require('../app');

function request() {
  return superagent(app.listen());
}

describe('Routes', function() {
  describe('POST /v1/users', function() {
    it('should return 201 - "Created" status', function(done) {
      var data = {
          "email": "dax.sorbito@email.com",
          "name": "dax",
          "password": "pass",
          "address": "add",
          "zipcode": "233"
      };

      request()
        .post('/v1/users')
        .set({'Content-Type':'application/json'})
        .send(data)
        .expect('Content-Type', /application\/json/)
        .expect(201)
        .end(function(err, result) {
          // expect password has been hashed
          expect(result.body.password).not.to.equal(data.password);
          done();
        });
    });
  });

  describe('GET /v1/users', function() {
    var data = {
      "email": "testUser1@email.com",
      "name": "daxGetTest",
      "password": "pass",
      "address": "add",
      "zipcode": "2345"
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
        .get('/v1/users?find={"name":"'+ data.name +'"}')
        .set({'Content-Type':'application/json'})
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, result) {
          expect(result.body).to.be.an('array');
          expect(result.body).to.not.be.empty();
          expect(result.body[0].name).to.be.eql(data.name);
          done();
        })
    });
  });

});
