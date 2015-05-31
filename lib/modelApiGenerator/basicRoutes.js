var pluralize = require('pluralize');

var BasicRoutes = function(route, version, modelName, basicMethods, paramIdName) {
  modelName = pluralize(modelName);
  paramIdName = ':' + paramIdName;

  route.post(version + ("/" + modelName), basicMethods.create);
  route.get(version + ("/" + modelName), basicMethods.find);

};


module.exports = BasicRoutes;
