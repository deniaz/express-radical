const mongoose = require('mongoose');

const schema = mongoose.Schema({
  message: String
});

module.exports = mongoose.model('Post', schema);
