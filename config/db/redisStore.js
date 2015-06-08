'use strict'
var config = require('./../config');
var redisStore = require('koa-redis');

module.exports = function() {
  function redisOptions() {
    return {
      host: config.redis.host,
      port: config.redis.port
    }
  };

  return {
    connect : function() {
      return redisStore(redisOptions());
    }
  };
};
