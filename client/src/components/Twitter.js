import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Twitter() {
    const [tweetContent, setTweetContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('api/v1/twitter/tweets', {
                tweetContent,
            });
            console.log(response.data); // Tweet sent successfully message
        } catch (error) {
            console.error(error);
        }
    };

    const handleTwitterAuth = () => {
        window.location.href = 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter';
    };


    return (
        <>
            <button onClick={handleTwitterAuth}>Authorize with Twitter</button>

            <form onSubmit={handleSubmit}>
                <textarea value={tweetContent} onChange={(e) => setTweetContent(e.target.value)} />
                <button type="submit">Tweet</button>
            </form>

        </>
    );
}

export default Twitter;