var basicRoutes = require('./basicRoutes');
var basicModelMethods = require('./basicModelMethods');

var CreateModelApi = function (version, route, model, paramIdName) {
  version = version || '';
  paramIdName = paramIdName || 'id';

  var basicMethods = basicModelMethods(model);
  basicRoutes(route, version, model.modelName, basicMethods, paramIdName);
};

module.exports = CreateModelApi;
