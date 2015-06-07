'use strict'

var dbConfig = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.connectionUrl());

var users = require('./users')(mongoose);

module.exports = { users : users };
