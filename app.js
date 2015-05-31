var koa = require('koa');
var router = require('koa-router')();
var generateApi = require('./lib/modelApiGenerator');
var bodyParser = require('koa-body-parser');
var app = koa();

var passwordHasher = require('./lib/middlewares/passwordHasher')

//router is required
app.use(bodyParser());
app.use(router.routes());
app.use(passwordHasher());

// this is for admin models API
var models = require('./models')
generateApi('/v1', router, models.users);

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}

module.exports = app;
