var koa = require('koa');
var router = require('koa-router')();
var generateApi = require('./lib/modelApiGenerator');
var bodyParser = require('koa-body-parser');
var validator = require('koa-validator');
var config = require('./config/config')
var app = koa();

var passwordHasher = require('./lib/middlewares/passwordHasher')
var userValidator = require('./lib/middlewares/modelValidators/users')

//router is required
app.use(bodyParser());
app.use(validator());
app.use(router.routes());
app.use(userValidator());
app.use(passwordHasher());


// this is for admin models API
var models = require('./models')
generateApi('/v1', router, models.users);

if (!module.parent) {
  app.listen(config.port);
  console.log('listening on port ' + config.port);
}

module.exports = app;
