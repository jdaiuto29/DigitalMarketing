const Twitter = require('twitter-lite');
const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Assuming you have a User model defined

// Initialize the Twitter client with your API keys and tokens
const twitterClient = new Twitter({
  consumer_key: '7tVzrnl36nY4HRuFfgylqbTsw',
  consumer_secret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
});

// Route to initiate Twitter authorization
router.get('/authorize', async (req, res) => {
  try {
    // Get the request token and redirect the user to the authorization URL
    const requestToken = await twitterClient.getRequestToken(
      'https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback'
    );
    const redirectURL = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken.oauth_token}`;
    res.redirect(redirectURL);
  } catch (error) {
    console.error('Twitter authorization error:', error);
    res.status(500).json({ error: 'Failed to initiate Twitter authorization' });
  }
});

// Callback route to handle the Twitter callback URL
router.get('/callback', async (req, res) => {
    const { oauth_token, oauth_verifier, userId } = req.query;
  
    try {
      // Exchange request token for access token
      const accessTokens = await twitterClient.getAccessToken({
        oauth_token,
        oauth_verifier,
      });
  
      // Store the user's credentials in your Users table
      await User.update(
        {
          twitter: {
            accessToken: accessTokens.oauth_token,
            accessTokenSecret: accessTokens.oauth_token_secret,
            // Add any other relevant user information from the `user` object
          },
        },
        { where: { id: userId } } // Use the passed user ID instead of `req.user.id`
      );
  
      res.redirect('/home'); // Redirect to a success page or perform any other desired action
    } catch (error) {
      console.error('Twitter authorization callback error:', error);
      res.status(500).json({ error: 'Failed to complete Twitter authorization' });
    }
  });
  

module.exports = router;
