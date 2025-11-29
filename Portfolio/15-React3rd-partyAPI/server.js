const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('./models/Movie');
const Comment = require('./models/Comment');
const app = express();

app.use(cors());
app.use(express.json());
// Servir archivos estáticos desde /public
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/starwars', { useNewUrlParser: true, useUnifiedTopology: true });

// GET all movies
app.get('/api/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// GET movie detail
app.get('/api/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
});

// POST like/dislike
app.post('/api/movies/:id/like', async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(movie);
});
app.post('/api/movies/:id/dislike', async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
  res.json(movie);
});

// GET/POST comments
app.get('/api/movies/:id/comments', async (req, res) => {
  const comments = await Comment.find({ movieId: req.params.id });
  res.json(comments);
});
app.post('/api/movies/:id/comments', async (req, res) => {
  const { name, text } = req.body;
  const comment = await Comment.create({ movieId: req.params.id, name, text });
  res.json(comment);
});

app.listen(4000, () => console.log('API running on port 4000'));
