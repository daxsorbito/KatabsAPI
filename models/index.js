'use strict'
// var mongoUrl = 'mongodb://serbisyo:'+ process.env.SERBISYO_PASSWORD +'@ds041337.mongolab.com:41337/serbisyo';
var mongoUrl = 'mongodb://192.168.50.4:27017/serbisyo'

var dbConfig = require('../config/db')
console.log(dbConfig.connectionUrl());
var mongoose = require('mongoose');
mongoose.connect(dbConfig.connectionUrl());



var users = require('./users')(mongoose);

module.exports = { users : users };
