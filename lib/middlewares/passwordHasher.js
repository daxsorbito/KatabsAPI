'use strict'
var bcrypt = require('co-bcrypt');

var PasswordHasher = function() {
  return function *(next) {
    yield next;
    if (this.method === 'POST') {
      if('password' in this.request.body) {
        let orgBody = this.request.body;

        let salt = yield bcrypt.genSalt(10);
        let hash = yield bcrypt.hash(orgBody.password, salt);

        orgBody.password = hash;
        this.request.body = orgBody;
      }
    }
  };
};
module.exports = PasswordHasher;

