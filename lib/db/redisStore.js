'use strict'
var config = require('../../config');
var redisStore = require('koa-redis');

module.exports = function() {
  function redisOptions() {
    return {
      host: config.REDIS.HOST,
      port: config.REDIS.PORT
    }
  };

  return {
    connect : function() {
      return redisStore(redisOptions());
    }
  };
};
