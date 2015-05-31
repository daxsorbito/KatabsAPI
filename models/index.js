'use strict'
var mongoUrl = 'mongodb://serbisyo:'+ process.env.SERBISYO_PASSWORD +'@ds041337.mongolab.com:41337/serbisyo';
console.log(mongoUrl);
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);



var users = require('./users')(mongoose);

module.exports = { users : users };
