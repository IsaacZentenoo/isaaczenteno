const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('./models/Movie');
const Comment = require('./models/Comment');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const JWT_SECRET = 'starwars_secret_key'; 

app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/starwars', { useNewUrlParser: true, useUnifiedTopology: true });

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials.' });
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, username: user.username });
});


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

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
  authMiddleware(req, res, async () => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json(movie);
  });
});
app.post('/api/movies/:id/dislike', async (req, res) => {
  authMiddleware(req, res, async () => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
    res.json(movie);
  });
});

// GET/POST comments
app.get('/api/movies/:id/comments', async (req, res) => {
  const comments = await Comment.find({ movieId: req.params.id });
  res.json(comments);
});
app.post('/api/movies/:id/comments', async (req, res) => {
  authMiddleware(req, res, async () => {
    const { name, text } = req.body;
    const comment = await Comment.create({ movieId: req.params.id, name, text });
    res.json(comment);
  });
});

app.listen(4000, () => console.log('API running on port 4000'));
