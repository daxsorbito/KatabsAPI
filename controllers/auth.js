'use strict'
var bcrypt = require('co-bcrypt');
var hat = require('hat');

var setResponseBody = require('../lib/responseBodySetter');
var users = require('../models/index').users;
var config = require('../config/config');
var redisStore = require('../config/db/redisStore')().connect();

var Auth = function(){

  return {
    login: function *(next) {
      yield next;
      try {
        var queryApi = users.find({user_name: this.request.body.user_name});
        var result = yield queryApi.exec()

        if(yield bcrypt.compare(this.request.body.org_pass, result[0].password))
        {
          yield redisStore.set(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + this.request.body.user_name, {"token": hat()}, config.TOKEN_EXPIRY);
          setResponseBody(this, 201, {token: 'token'});
        }
        else
        {
          setResponseBody(this, 403, {error: 'Invalid login'});
        }
        return this.body;
      } catch (err) {
        return this.body = err;
      }
    }
  }
};

module.exports = Auth;
