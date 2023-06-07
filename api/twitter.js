const express = require('express');
const router = express.Router();
const models = require('../models'); // Assuming you have a User model defined
const TwitterLite = require('twitter-lite');

// API endpoint to send tweets
router.post('/tweets', async (req, res) => {
  const { tweetContent } = req.body;
  const userId = req.session.userId;

  try {
    const user = await models.User.findOne({ where: { id: userId } });
    if (!user || !user.twitter) {
      return res.status(404).json({ error: 'User tokens not found' });
    }

    const twitterToken = user.twitter.twitterToken;
    const twitterSecret = user.twitter.twitterSecret;

    const twitterClient = new TwitterLite({
      consumer_key: '7tVzrnl36nY4HRuFfgylqbTsw',
      consumer_secret: 'cFx0ctjvpIxxLwsc5vCbIj3tsAvtacfYkw311VIipqvXmWWTdm',
      access_token_key: "1665087749051895809-bzo58Xfbq8WT39zWFL0ANTClsH86Wo",
      access_token_secret: "u8grSR32hCi2DJU5L7rgH1uqSKVBmKNdTNRpe3wI4bSeh",
      version: '2', // Use Twitter API v2
    });

    console.log(twitterClient);

    // Update the tweet status using the v2 endpoint
    const tweetResponse = await twitterClient.post('tweets', {
      text: tweetContent,
    });

    if (tweetResponse.errors) {
      // Handle any errors returned by the API
      console.error(tweetResponse.errors);
      res.status(500).json({ error: 'Error posting tweet' });
    } else {
      res.status(200).json({ message: 'Tweet sent successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error posting tweet' });
  }
});

module.exports = router;
