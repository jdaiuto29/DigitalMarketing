const express = require('express');
const router = express.Router();
const models = require('../models'); // Assuming you have a User model defined
const Twit = require('twit');

// API endpoint to send tweets
router.post('/tweets', async (req, res) => {
    const { tweetContent } = req.body;
    const userId = req.session.user.id
  
    try {
      const user = await models.User.findOne({ where: { userId } });
      if (!user.twitter) {
        return res.status(404).json({ error: 'User tokens not found' });
      }
  
      const twitClient = new Twit({
        consumerKey: '7tVzrnl36nY4HRuFfgylqbTsw',
        consumerSecret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
        access_token: user.twitter.twitterToken,
        access_token_secret: user.twitter.twitterSecret,
      });
  
      await twitClient.post('statuses/update', { status: tweetContent });
  
      res.status(200).json({ message: 'Tweet sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error posting tweet' });
    }
  });

module.exports = router;
