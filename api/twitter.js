const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');
const router = express.Router();

passport.use(new TwitterStrategy({
  consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
  consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
  callbackURL: "https://walrus-app-zynat.ondigitalocean.app/twitter/callback"
},
function(token, tokenSecret, profile, cb) {
  User.findOne({ where: { id: 3 } }).then((user) => {
    if (user) {
      user.update({ twitter: { token, tokenSecret } });
      return cb(null, user);
    } else {
      res.send('auth didnt work')
    }
  });
}));

router.get('/auth/twitter', async (req, res) => {
res.json('hello')
})
;

router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
  });

module.exports = router;