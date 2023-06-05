import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; // Assuming you are using Redux for state management
import { logout } from '../redux/reducers/userReducer'; // Import the loggedIn action
import { useNavigate } from "react-router-dom";

const Home = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

      	// Handle Logout
          const handleLogout = () => {
            dispatch(logout()); // Dispatch the logout action
          
            // Remove the token from the client-side (e.g., delete the token from local storage or cookie)
            localStorage.removeItem('token'); // Example: Removing the token from local storage
          
            navigate('/sign-in'); // Navigate to the sign-in page
          };

  return (
    <div className="container">
<h1>Home</h1>
<h3>Hello {currentUser?.firstName}</h3>
<Button variant="primary" onClick={handleLogout}>
          Log Out
        </Button>
    </div>
  );
};

export default Home;
