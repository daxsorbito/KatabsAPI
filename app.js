var koa = require('koa');
var router = require('koa-router')();
var generateApi = require('koa-mongo-rest');
var app = module.exports = koa();

var bodyJSONParser = require('./lib/parseBodyToJSON')

//router is required
app.use(router.routes());
app.use(bodyJSONParser());


//add REST routes to your app. Prefix is optional
var users = require('./models/users')
generateApi(router, users, '/v1');

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}
