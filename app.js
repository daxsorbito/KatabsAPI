//var koa = require('koa');
//var router = require('koa-router')();
//var generateApi = require('./lib/modelApiGenerator');
//var bodyParser = require('koa-body-parser');
//var validator = require('koa-validator');
//var config = require('./config/index');
//var auth = require('./controllers/auth')();
//var app = koa();
//
//var passwordHasher = require('./lib/middlewares/passwordHasher');
//var authenticate = require('./lib/middlewares/authenticate');
//var userValidator = require('./lib/middlewares/modelValidators/users');
//
////router is required
//app.use(bodyParser());
//app.use(validator());
//app.use(router.routes());
//app.use(authenticate({except: ['/v1/auth/login', '/v1/auth/logout']}));
//app.use(userValidator());
//app.use(passwordHasher());
//
//
//// this is for admin models API
//var models = require('./models')
//generateApi('/v1', router, models.users);
//
//// specific routes
//router.post('/v1/auth/login', auth.login);
//router.post('/v1/auth/logout', auth.logout);
//
//if (!module.parent) {
//  app.listen(config.port);
//  console.log('listening on port ' + config.port);
//}

var koa = require('koa');
var router = require('koa-router')();
var app = koa();

app.use(router.routes());

// middleware
app.use(function *(next){
  yield next;
  var valid = false;
  if (!valid){
    console.log('entered validation')
    this.body = "error"
    return this.body; // how to stop the execution in here
  }

});

// route
router.get('/', function *(next){
  yield next;
  console.log('entered route')
  this.body = "should not enter here";
});


app.listen(3000);

module.exports = app;
