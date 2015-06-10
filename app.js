var koa = require('koa');
var router = require('koa-router')();
var generateApi = require('./lib/modelApiGenerator');
var bodyParser = require('koa-body-parser');
var validator = require('koa-validator');
var config = require('./config/config');
var auth = require('./controllers/auth')();
var app = koa();

var passwordHasher = require('./lib/middlewares/passwordHasher');
var authenticate = require('./lib/middlewares/authenticate');
var userValidator = require('./lib/middlewares/modelValidators/users');

//router is required
app.use(bodyParser());
app.use(validator());
app.use(router.routes());
app.use(authenticate({except: ['/v1/auth/login']}));
app.use(userValidator());
app.use(passwordHasher());


// this is for admin models API
var models = require('./models')
generateApi('/v1', router, models.users);

// specific routes
router.post('/v1/auth/login', auth.login);

if (!module.parent) {
  app.listen(config.port);
  console.log('listening on port ' + config.port);
}

module.exports = app;
