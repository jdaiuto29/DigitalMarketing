const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const model = require('../models');
const router = express.Router();

// Configure Twitter authentication strategy
passport.use(new TwitterStrategy({
    consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
    consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
    callbackURL: 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback',
  }, async (token, tokenSecret, profile, done) => {
    try {
      // Find the existing user in the database
      const user = await model.User.findOne({ where: { id: 1 } });
  
      if (user) {
        // Update the user's Twitter tokens
        await user.update({ twitter: JSON.stringify({ twitterToken: token, twitterSecret: tokenSecret }) });
        console.log('User updated:', user);
        console.log(profile)
        done(null, user);
      } else {
        // Handle the case when the user is not found in the database
        done(new Error('User not found.'));
      }
    } catch (error) {
      done(error);
    }
  }));
  
  // Route for initiating the Twitter authentication flow
  router.get('/auth/twitter', passport.authenticate('twitter'));
  
  // Callback route to handle the Twitter authentication callback
  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req, res) => {
      // Access the authenticated user details from req.user
      console.log('Authenticated User:', req.user);
      // Perform any required actions or redirect the user to the appropriate page
      res.redirect('/home');
    });

module.exports = router;
