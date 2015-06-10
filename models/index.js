'use strict'
var mongooseStore = require('../lib/db/mongooseStore')();
var mongoose = mongooseStore.connect();

var users = require('./users')(mongoose);

module.exports = { users : users };
