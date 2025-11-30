const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movieId: String,
  name: String,
  text: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
