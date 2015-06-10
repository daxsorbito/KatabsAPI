'use strict'
var config = require('../../config');
var mongoose = require('mongoose');

module.exports = function() {
  function connectionUrl() {
    var urlOptions = config.DB.USERNAME + ":" + config.DB.PASSWORD + "@";

    return 'mongodb://' + (urlOptions === ":@" ? "" : urlOptions) + config.DB.HOST + ":" + config.DB.PORT + "/" + config.DB.DATABASE_NAME;
  };

  return {
    connect : function() {
        mongoose.connect(connectionUrl());
        return mongoose;
      }
  };
};
