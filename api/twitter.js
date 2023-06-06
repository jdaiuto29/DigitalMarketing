// twitterRoutes.js

const express = require('express');
const models = require('../models');

const router = express.Router();
// Twitter authentication route
router.get('/auth/twitter', (req, res) => {
    const apiKey = '7tVzrnl36nY4HRuFfgylqbTsw';
    const callbackUrl = 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback';
  
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${apiKey}&oauth_callback=${callbackUrl}`);
  });
  
  // Callback route to handle the Twitter authentication callback
  router.get('/auth/twitter/callback', async (req, res) => {
    const apiKey = '7tVzrnl36nY4HRuFfgylqbTsw';
    const apiSecretKey = 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm';
    const requestToken = req.query.oauth_token;
    const oauthVerifier = req.query.oauth_verifier;
  
    try {
      const response = await axios.post('https://api.twitter.com/oauth/access_token', null, {
        auth: {
          username: apiKey,
          password: apiSecretKey,
        },
        params: {
          oauth_token: requestToken,
          oauth_verifier: oauthVerifier,
        },
      });
  
      const accessToken = response.data.oauth_token;
      const accessTokenSecret = response.data.oauth_token_secret;
  
      const [user] = await models.User.findOrCreate({
        where: { id: req.session.user.id},
      });
  
      const tokens = {
        accessToken,
        accessTokenSecret,
      };
  
      user.twitter = tokens;
      await user.save();
  
      // Handle your application-specific logic here
  
      res.send('Authentication successful! You can close this window.');
    } catch (error) {
      console.error('Twitter authentication error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
