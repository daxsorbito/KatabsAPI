
var ResponseBodySetter = function(ctx, statusCode, result){
  ctx.type ='application/json';
  ctx.status = statusCode;
  ctx.body = result;
};

module.exports = ResponseBodySetter;
