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
      if (this.haveValidationError()) return this.body;
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
    },

    findById: function *(next) {
      yield next;
      var error, result;
      try {
        result = yield model.findById(this.params.id).exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    deleteById: function*(next) {
      yield next;
      var error, result;
      try {
        result = yield model.findByIdAndRemove(this.params.id).exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    replaceById: function*(next) {
      yield next;
      var body, error, newDocument, result;
      try {
        yield model.findByIdAndRemove(this.params.id).exec();
        body = yield parse.json(this, {
          limit: '1kb'
        });
        newDocument = body;
        newDocument._id = this.params.id;
        result = yield model.create(newDocument);
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    },
    updateById: function*(next) {
      yield next;
      var body, error, result;
      try {
        body = yield parse.json(this, {
          limit: '1kb'
        });
        result = yield model.findByIdAndUpdate(this.params.id, body, {new: true}).exec();
        return this.body = result;
      } catch (_error) {
        error = _error;
        return this.body = error;
      }
    }


  };
};

module.exports = BasicModelMethods;
