'use strict'
var BasicModelMethods = function(model) {
  function setResponseBody(ctx, statusCode, result){
    ctx.status = statusCode;
    ctx.type ='application/json';
    ctx.body = result;
  }
  return {
    create: function *(next) {
      yield next;

      try {
        var result = yield model.create(this.request.body);
        setResponseBody(this, 201, result);
        return this.body;
      } catch (err) {
        return this.body = err;
      }
    },

    find: function *(next) {
      yield next;

      try {
        var conditions = {};
        var query = this.request.query;

        if (query.find) {
          conditions = JSON.parse(query.find);
        }
        var queryApi = model.find(conditions);
        ['where', 'limit', 'skip', 'sort'].forEach(function(key) {
          if (query[key]) {
            queryApi[key](query[key]);
          }
        });
        var result = yield queryApi.exec();
        setResponseBody(this, 200, result);
        return this.body;
      } catch (err) {
        return this.body = err;
      }
    }

  };
};

module.exports = BasicModelMethods;
