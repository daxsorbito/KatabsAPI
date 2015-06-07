//'use strict';
//var superagent = require('supertest');
//var expect = require('expect.js') // may be change to chai
//var app = require('../app');
//
//function request() {
//  return superagent(app.listen());
//}
//
//describe('Auth', function() {
//  describe('Login', function() {
//    describe('POST auth/login', function(){
//      it('should be able to login with proper credentials', function(done){
//        var data = {
//          "email": "dax.sorbito@logintest.com",
//          "user_name": "dax.sorbito",
//          "password": "pass",
//          "first_name": "dax",
//          "last_name": "sorbito",
//          "address1": "cebu city",
//          "zip_code": 6000,
//          "user_type": 1
//        };
//
//        request()
//          .post('/v1/users')
//          .set({'Content-Type':'application/json'})
//          .send(data)
//          .end(function(err, result) {
//            // expect password has been hashed
//            expect(result.headers["content-type"]).to.equal("application/json; charset=utf-8");
//            expect(result.statusCode).to.equal(201);
//            expect(result.body.password).not.to.equal(data.password);
//            request()
//              .post('/vi/auth/login')
//              .set({'Content-Type': 'application/json'})
//              .send({username: data.user_name, password: data.password})
//              .end(function(err, result){
//                expect(result.header["content-type"]).to.equal("application/json; charset=utf-8");
//                expect(result.statusCode).to.equal(200);
//                expect(result.body.token).to.not.be.empty();
//              });
//          });
//      });
//    });
//  });
//});
