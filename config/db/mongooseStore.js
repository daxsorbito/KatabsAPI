'use strict'
var config = require('./../config');
var mongoose = require('mongoose');

module.exports = function() {
  function connectionUrl() {
    var urlOptions = config.db.username + ":" + config.db.password + "@";

    return 'mongodb://' + (urlOptions === ":@" ? "" : urlOptions) + config.db.host + ":" + config.db.port + "/" + config.db.database_name;
  };

  return {
    connect : function() {
        mongoose.connect(connectionUrl());
        return mongoose;
      }
  };
};
