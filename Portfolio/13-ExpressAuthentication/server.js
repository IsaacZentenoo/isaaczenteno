require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  googleId: String,
  secrets: [String]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/secrets"
},
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  User.register({ username: req.body.username, email: req.body.email }, req.body.password, function(err, user) {
    if (err) {
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/secrets');
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/secrets');
});

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('secrets', { user: req.user, secrets: req.user.secrets || [] });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    res.redirect('/login');
  });
});

// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/secrets', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/secrets');
});

// Submit secret
app.post('/submit', async (req, res) => {
  if (req.isAuthenticated()) {
    const secret = req.body.secret;
    try {
      await User.findByIdAndUpdate(req.user._id, { $push: { secrets: secret } });
      res.redirect('/secrets');
    } catch (err) {
      res.redirect('/secrets');
    }
  } else {
    res.redirect('/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
