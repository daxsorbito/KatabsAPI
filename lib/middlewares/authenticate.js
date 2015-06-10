var _ = require('lodash');
var config = require('../../config');
var setResponseBody = require('../../lib/responseBodySetter');

var Authenticate = function(options) {
  'use strict';
  var defaultOptions = {
    except : []
  };
  options = _.extend(defaultOptions, options);

  return function *(next) {
    if (options.except.indexOf(this.url) === -1 ) { // TODO:  look for exempted URL for authentication
      this.checkHeader(config.HEADER.HEADER_TOKEN.toLowerCase()).notEmpty();
      this.checkHeader(config.HEADER.USER_NAME.toLowerCase()).notEmpty();

      var errData = {error: "Unauthorized"};

      if(this.haveValidationError()) {
        setResponseBody(this, 403, errData);
        this._validationErrors = this._validationErrors || [];
        this._validationErrors.push(errData);
      } else {
        var redisStore = require('../db/redisStore')().connect();

        var user_name = this.request.headers[config.HEADER.USER_NAME.toLowerCase()];
        var security_token = this.request.headers[config.HEADER.HEADER_TOKEN.toLowerCase()];

        var result = yield redisStore.get(config.REDIS.PREFIX_KEY + ":USER_TOKEN:" + user_name);

        if(result.token !== security_token){
          setResponseBody(this, 403, errData);
          this._validationErrors = this._validationErrors || [];
          this._validationErrors.push(errData);
        }
      }
    }

    yield next;
  };
};

module.exports = Authenticate;
