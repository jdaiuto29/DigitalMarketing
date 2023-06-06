const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');
const router = express.Router();

// Configure Twitter authentication strategy
passport.use(new TwitterStrategy({
    consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
    consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
    callbackURL: 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback',
  }, (token, tokenSecret, profile, done) => {
    // Handle the authenticated user data here
    // You can save the user details in your database or perform any other required actions
    console.log('Authenticated User:', profile);
    console.log('token:', token)
    console.log('tokenSecret:', tokenSecret)
    done(null, profile);
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
      console.log('Authenticated User:', req.user);
      // Perform any required actions or redirect the user to the appropriate page
      res.redirect('/home');
    });

module.exports = router;
