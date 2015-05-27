mongoUrl = 'mongodb://serbisyo:'+ process.env.SERBISYO_PASSWORD +'@ds041337.mongolab.com:41337/serbisyo';
mongoose = require('mongoose');
mongoose.connect(mongoUrl);

schema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  address: String,
  zipcode: Number
});

module.exports = mongoose.model('users', schema);
