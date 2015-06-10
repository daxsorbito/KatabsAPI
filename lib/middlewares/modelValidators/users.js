var setResponseBody = require('../../../lib/responseBodySetter');
var UserValidator = function() {
  'use strict';
  return function *(next) {
    if(['POST', 'PUT'].indexOf(this.method) >= 0 && this.request.url.lastIndexOf('/v1/users', 0) === 0 && !this.haveValidationError()) {
      this.checkBody('email').isEmail();
      this.checkBody('user_name').notEmpty().len(2, 20);
      this.checkBody('password').notEmpty().len(4, 20);
      this.checkBody('first_name').notEmpty();
      this.checkBody('last_name').notEmpty();

      if(this.haveValidationError()) {
        setResponseBody(this, 400, this.validationErrors());
      }
    }
    yield next;
  };
};

module.exports = UserValidator;
