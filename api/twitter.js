// twitterRoutes.js

const express = require('express');
const Twitter = require('twitter-lite');
const db = require('../models');

const router = express.Router();
const client = new Twitter({
  consumer_key: '7tVzrnl36nY4HRuFfgylqbTsw',
  consumer_secret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
});

function isTwitterAccessTokenExpired(user) {
  if (!user.twitter || !user.twitter.expiresAt) {
    return true; // If tokens or expiration info are missing, assume expired
  }

  const currentTime = new Date().getTime();
  return currentTime >= user.twitter.expiresAt;
}

async function refreshTwitterAccessToken(user) {
  if (isTwitterAccessTokenExpired(user)) {
    try {
      const response = await client.refreshToken({
        oauth_token: user.twitter.token,
        oauth_token_secret: user.twitter.tokenSecret,
      });

      user.twitter.token = response.oauth_token;
      user.twitter.tokenSecret = response.oauth_token_secret;
      user.twitter.expiresIn = response.oauth_callback_confirmed.expires_in;
      user.twitter.expiresAt = new Date().getTime() + response.oauth_callback_confirmed.expires_in * 1000;
      await user.save();
    } catch (error) {
      console.error('Error refreshing Twitter access token:', error);
      throw new Error('Failed to refresh Twitter access token.');
    }
  }
}

router.get('/auth/twitter', (req, res) => {
  client
    .getRequestToken('https://walrus-app-zynat.ondigitalocean.app/auth/twitter/callback')
    .then((response) => {
      const { oauth_token, oauth_token_secret } = response;
      req.session.oauthToken = oauth_token;
      req.session.oauthTokenSecret = oauth_token_secret;
      res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send('An error occurred.');
    });
});

router.get('/auth/twitter/callback', async (req, res) => {
  const { oauthToken, oauthVerifier } = req.query;

  if (req.session.oauthToken !== oauthToken) {
    res.status(403).send('Invalid OAuth token.');
    return;
  }

  try {
    const response = await client.getAccessToken({
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    });

    const { oauth_token, oauth_token_secret, user_id } = response;

    const user = await db.User.findOne({ where: { id: req.session.userId } });

    if (user) {
      const twitterTokens = {
        token: oauth_token,
        tokenSecret: oauth_token_secret,
        expiresIn: response.oauth_callback_confirmed.expires_in,
        expiresAt: new Date().getTime() + response.oauth_callback_confirmed.expires_in * 1000,
      };
      user.twitter = twitterTokens;
      await user.save();
      console.log('User updated:', user);
    } else {
      console.log('User not found.');
    }

    req.session.oauthAccessToken = oauth_token;
    req.session.oauthAccessTokenSecret = oauth_token_secret;

    res.redirect('/tweet');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});

router.get('/tweet', async (req, res) => {
  if (!req.session.oauthAccessToken || !req.session.oauthAccessTokenSecret) {
    res.status(403).send('Unauthorized.');
    return;
  }

  const user = await db.User.findOne({ where: { id: req.session.user.id } });

  res.send(`
    <form action="/twitter/tweet" method="POST">
      <textarea name="tweetText" rows="4" cols="50"></textarea><br>
      <input type="submit" value="Tweet">
    </form>
  `);
});

router.post('/tweet', async (req, res) => {
  if (!req.session.oauthAccessToken || !req.session.oauthAccessTokenSecret) {
    res.status(403).send('Unauthorized.');
    return;
  }

  const { tweetText } = req.body;

  const user = await db.User.findOne({ where: { id: req.session.userId } });

  try {
    await refreshTwitterAccessToken(user);

    const userClient = new Twitter({
      consumer_key: '7tVzrnl36nY4HRuFfgylqbTsw',
      consumer_secret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
      access_token_key: user.twitter.token,
      access_token_secret: user.twitter.tokenSecret,
    });

    await userClient.post('statuses/update', { status: tweetText });

    res.send('Tweet posted successfully!');
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).send('An error occurred while posting the tweet.');
  }
});

module.exports = router;
