'use strict'
var bcrypt = require('co-bcrypt');
var hat = require('hat');

var users = require('../models/index').users;
var config = require('../config/config');
var redisStore = require('../config/db/redisStore')().connect();

var Auth = function(){
  function setResponseBody(ctx, statusCode, result){
    ctx.status = statusCode;
    ctx.type ='application/json';
    ctx.body = result;
  };
  return {
    login: function *(next) {
      yield next;
      try {
        var queryApi = users.find({user_name: this.request.body.user_name});
        var result = yield queryApi.exec()

        if(yield bcrypt.compare(this.request.body.org_pass, result[0].password))
        {
          yield redisStore.set(config.redis.prefix_key + ":USER_TOKEN:" + this.request.body.user_name, {"token": hat()}, config.token_expiry);
          setResponseBody(this, 201, {token: 'token'});
        }
        else
        {
          setResponseBody(this, 403, {error: 'error'});
        }
        return this.body;
      } catch (err) {
        console.log(err);
        return this.body = err;
      }
    }
  }
};

module.exports = Auth;
