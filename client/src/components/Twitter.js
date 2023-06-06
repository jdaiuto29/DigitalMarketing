import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Twitter() {
    const [tweets, setTweets] = useState([]);
    const [tweetText, setTweetText] = useState('');
  
    useEffect(() => {
      fetchTweets();
    }, []);
  
    const fetchTweets = async () => {
      try {
        const response = await axios.get('api/v1/tweets');
        setTweets(response.data.tweets);
      } catch (error) {
        console.error(error);
      }
    };
  
    const authTweet = async () => {
      try {
        const response = await axios.get('api/v1/twitter/auth/twitter');
        console.log(response);

      } catch (error) {
        console.error(error);
      }
    };

    const handleTwitterAuth = () => {
        window.location.href = 'https://walrus-app-zynat.ondigitalocean.app/api/v1/twitter/auth/twitter';
      };
    
  
    return (
      <>
                    <button onClick={handleTwitterAuth}>Authorize with Twitter</button>
                    <button onClick={authTweet}>Authorize with Twitter Test</button>

              </>
    );
  }
  
  export default Twitter;