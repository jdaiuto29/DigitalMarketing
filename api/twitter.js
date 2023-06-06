const express = require('express');
const router = express.Router();
const models = require('../models'); // Assuming you have a User model defined
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

// Configure Twitter authentication strategy
passport.use(new TwitterStrategy({
    consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
    consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
    callbackURL: 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback',
    passReqToCallback: true,
  }, async (req, token, tokenSecret, profile, done) => {
    try {
      // Assuming you stored user ID in req.session
      // @ts-ignore
      const userId = req.session.userId;
      // Find the existing user in the database
      console.log('user id', userId)
      const user = await models.User.findOne({ where: { id: userId } });
  
      if (user) {
        // Update the user's Twitter tokens
        await user.update({ twitter: JSON.stringify({ twitterToken: token, twitterSecret: tokenSecret }) });
        console.log('User updated:', user);
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
