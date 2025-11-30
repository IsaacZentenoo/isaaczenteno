const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  affiliation: String,
  bio: String,
  image: String
});

const movieSchema = new mongoose.Schema({
  episode: Number,
  title: String,
  year: Number,
  poster: String,
  best_character: characterSchema,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Movie', movieSchema);
