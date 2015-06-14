'use strict'
var bcrypt = require('co-bcrypt');
var hat = require('hat');

var setResponseBody = require('../lib/responseBodySetter');
var users = require('../models').users;
var config = require('../config');
var redisStore = require('../lib/db/redisStore')().connect();

var Auth = function () {
  function *validateUserPassword(user_name, password) {
    var queryApi = users.find({user_name: user_name});
    var result = yield queryApi.exec();
    return yield bcrypt.compare(password, result[0].password);
  };

  return {
    login: function *(next) {
      yield next;
      try {

        if(yield validateUserPassword(this.request.body.user_name, this.request.body.org_pass))
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
    },

    logout: function *(next) {
      yield next;
      var user_name = this.request.headers[config.HEADER.USER_NAME.toLowerCase()];
      yield redisStore.destroy(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + user_name);
      setResponseBody(this, 200, {});
      return this.body;
    },

    resetPassword: function *(next){
      yield next;
      var user_name = this.request.body.user_name;
      if(yield validateUserPassword(user_name, this.request.body.org_current_pass))
      {
        yield users.update({user_name: user_name}, {password: this.request.body.password}).exec();
        setResponseBody(this, 200, {});
        return this.body
      }
    }
  };
};

module.exports = Auth;
