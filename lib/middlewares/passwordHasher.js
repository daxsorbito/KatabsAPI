'use strict'

var PasswordHasher = function() {
  return function *(next) {
    if (['POST', 'PUT'].indexOf(this.method) >= 0  && 'password' in this.request.body) {
      var bcrypt = require('co-bcrypt');

      let orgBody = this.request.body;

      let salt = yield bcrypt.genSalt(10);
      let hash = yield bcrypt.hash(orgBody.password, salt);

      orgBody.password = hash;
      this.request.body = orgBody;
    }
    yield next;
  };
};
module.exports = PasswordHasher;

