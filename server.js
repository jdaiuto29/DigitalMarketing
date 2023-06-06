//@ts-check
require("dotenv").config()
const createError = require('http-errors');
const session = require('express-session')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require("./models");
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const SequelizeSession = require('connect-session-sequelize')(session.Store)
const store = new SequelizeSession({ db: db.sequelize })
const usersRouter = require('./api/users');
const twitterRouter = require('./api/twitter');
const cors = require("cors");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 259200000,
    },
    store: store
  })
);
store.sync();
app.use(express.static(path.join(__dirname, 'client/build')));


app.use('/api/v1/users', usersRouter);
// app.use('/api/v1/twitter', twitterRouter);

app.use(passport.initialize());

passport.use(
  new TwitterStrategy(
    {
      consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
      consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
      callbackURL: 'https://walrus-app-zynat.ondigitalocean.app/twitter/callback',
    },
    function (token, tokenSecret, profile, done) {
      // Handle the user profile obtained from Twitter
      // You can save the user details in your database and generate a session or JWT token
      console.log('token', token , 'tokenSecret', tokenSecret)
      return done(null, profile);
    }
  )
);

// Routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  function (req, res) {
    // Handle successful authentication
    // You can redirect the user or return an access token
    res.send('Authentication successful!');
  }
);



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

module.exports = app;
