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

// Configure Twitter authentication strategy
passport.use(new TwitterStrategy({
  consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
  consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
  callbackURL: 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback',
  passReqToCallback: true,
}, async (req, token, tokenSecret, profile, done) => {
  try {
    // @ts-ignore
    const userId = req.user.id
    // Find the existing user in the database
    const currentUser = await db.User.findOne({ where: { id: userId} });

    if (currentUser) {
      // Update the user's Twitter tokens
      await currentUser.update({ twitter: JSON.stringify({ twitterToken: token, twitterSecret: tokenSecret }) });
      console.log('User updated:', currentUser);
      console.log(profile)
      console.log(token)
      console.log(tokenSecret)
      done(null, currentUser);
    } else {
      // Handle the case when the user is not found in the database
      done(new Error('User not found.'));
    }
  } catch (error) {
    done(error);
  }
}));

// Initialize Passport
app.use(passport.initialize());

// Route for initiating the Twitter authentication flow
app.get('/auth/twitter', passport.authenticate('twitter'));

// Callback route to handle the Twitter authentication callback
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) => {
    // Access the authenticated user details from req.user
    // @ts-ignore
    console.log('Authenticated User:', req.user.dataValues.id);
    // Perform any required actions or redirect the user to the appropriate page
    res.redirect('/home');
  });



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
