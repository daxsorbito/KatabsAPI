module.exports = function parseBodyToJSON() {
  return function *parseBodyToJSON(next) {

    //this.body = JSON.parse(this.body);
    return yield next;
  };
};
