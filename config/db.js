'use strict'
var config = require('./config')

module.exports = {
  connectionUrl: function(){
    var urlOptions = config.db.username + ":" + config.db.password + "@";

    return 'mongodb://' + (urlOptions === ":@" ? "" : urlOptions) + config.db.host + ":" + config.db.port + "/" + config.db.database_name;
  }
};
