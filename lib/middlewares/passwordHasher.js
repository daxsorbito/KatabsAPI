

var PasswordHasher = function() {
  'use strict';
  function *hashField(password) {
    var bcrypt = require('co-bcrypt');
    let salt = yield bcrypt.genSalt(10);
    let hash = yield bcrypt.hash(password, salt);
    return hash;
  }
  return function *(next) {
    if (['POST', 'PUT'].indexOf(this.method) >= 0  && 'password' in this.request.body) {
      let orgBody = this.request.body;

      orgBody.org_pass = orgBody.password;
      orgBody.password = yield hashField(orgBody.password);

      if('currentPassword' in this.request.body) {
        orgBody.org_current_pass = orgBody.currentPassword;
        orgBody.currentPassword = yield hashField(orgBody.currentPassword);
      }
      this.request.body = orgBody;
    }
    yield next;
  };
};

module.exports = PasswordHasher;
