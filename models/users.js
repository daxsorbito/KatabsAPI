
function Users(mongoose) {
  var schema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    address: String,
    zipcode: Number
  });

  return mongoose.model('user', schema);
}

module.exports = Users;
