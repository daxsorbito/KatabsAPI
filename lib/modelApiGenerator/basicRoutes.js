var pluralize = require('pluralize');

var BasicRoutes = function(route, version, modelName, basicMethods, paramIdName, primaryKeyName) {
  modelName = pluralize(modelName);
  paramIdName = ':' + paramIdName;

  route.post(version + ("/" + modelName), basicMethods.create);
  route.get(version + ("/" + modelName), basicMethods.find);
  route.get(version + ("/" + modelName + "/" + paramIdName), basicMethods.findById);
  route.del(version + ("/" + modelName + "/" + paramIdName), basicMethods.deleteById);
  route.put(version + ("/" + modelName + "/" + paramIdName), basicMethods.replaceById);
  route.post(version + ("/" + modelName + "/" + paramIdName), basicMethods.updateById);
};

module.exports = BasicRoutes;
