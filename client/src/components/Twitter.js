import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Twitter() {

    const handleTwitterAuth = () => {
        window.location.href = 'https://walrus-app-zynat.ondigitalocean.app/auth/twitter';
      };      
    
  
    return (
      <>
                    <button onClick={handleTwitterAuth}>Authorize with Twitter</button>

              </>
    );
  }
  
  export default Twitter;