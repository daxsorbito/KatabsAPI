
function Users(mongoose) {
  var schema = new mongoose.Schema({
    email: String,
    user_name: String,
    password: String,
    first_name: String,
    last_name: String,
    address1: String,
    zip_code: Number,
    user_type: Number // 0 - server, 1 = client , -1 special
  });

  return mongoose.model('user', schema);
}

module.exports = Users;
