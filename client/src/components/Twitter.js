import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Assuming you are using Redux for state management


function Twitter() {
    const [tweets, setTweets] = useState([]);
    const [tweetText, setTweetText] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);
  
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
        axios.get('/api/v1/twitter/authorize?userId=' + currentUser.id)
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    // Handle errors
  });
      };     
    
  
    return (
      <>
                    <button onClick={handleTwitterAuth}>Authorize with Twitter</button>

              </>
    );
  }
  
  export default Twitter;