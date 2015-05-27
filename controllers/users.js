'use strict';
var views = require('co-views');
var parse = require('co-body');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('mongodb://serbisyo:'+ process.env.SERBISYO_PASSWORD +'@ds041337.mongolab.com:41337/serbisyo');
var co = require('co');

var books = wrap(db.get('books'));

// From lifeofjs
co(function * () {
  var books = yield books.find({});
});

var Book = {
  // This must be avoided, use ajax in the view.
  all : function * all(next){
    if ('GET' != this.method) return yield next;
    this.body = yield books.find({});
  },

  fetch: function *fetch(id, next){
    if ('GET' != this.method) return yield next;
    // Quick hack.
    if(id === ""+parseInt(id, 10)){
      var book = yield books.find({}, {
        'skip': id - 1,
        'limit': 1
      });
      if (book.length === 0) {
        this.throw(404, 'book with id = ' + id + ' was not found');
      }
      this.body = yield book;
    }
  },

  add: function *add(data, next){
    if ('POST' != this.method) return yield next;
    var book = yield parse(this, {
      limit: '1kb'
    });
    var inserted = yield books.insert(book);
    if (!inserted) {
      this.throw(405, "The book couldn't be added.");
    }
    this.body = 'Done!';
  },

  modify: function *modify(id, next){
    if ('PUT' != this.method) return yield next;

    var data = yield parse(this, {
      limit: '1kb'
    });

    var book = yield books.find({}, {
      'skip': id - 1,
      'limit': 1
    });

    if (book.length === 0) {
      this.throw(404, 'book with id = ' + id + ' was not found');
    }

    var updated = books.update(book[0], {
      $set: data
    });

    if (!updated) {
      this.throw(405, "Unable to update.");
    } else {
      this.body = "Done";
    }
  },

  remove: function *remove(id, next){
    if ('DELETE' != this.method) return yield next;

    var book = yield books.find({}, {
      'skip': id - 1,
      'limit': 1
    });

    if (book.length === 0) {
      this.throw(404, 'book with id = ' + id + ' was not found');
    }

    var removed = books.remove(book[0]);

    if (!removed) {
      this.throw(405, "Unable to delete.");
    } else {
      this.body = "Done";
    }

  },

  head: function *(){
    return;
  },

  options: function *(){
    this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
  },

  trace: function *(){
    this.body = "Smart! But you can't trace.";
  }
};

module.exports = Book;