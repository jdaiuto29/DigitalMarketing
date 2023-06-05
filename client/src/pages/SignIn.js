import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../redux/reducers/userReducer';
import { useNavigate, Link } from 'react-router-dom';
import NDMLogo from '../assets/NDM_logo.png';

const SignIn = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/users/login', user);

      const { token, user: userData } = response.data;

      // Save the token in local storage or a cookie
      localStorage.setItem('token', token);

      // Dispatch the loggedIn action with the user data
      dispatch(loggedIn(userData));

      navigate('/home');
      setUser({
        email: '',
        password: '',
      });
    } catch (err) {
      console.error('Error signing in:', err.response);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during sign in');
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container bg-white p-5 w-50">
        <div className="text-start mb-4">
          <img src={NDMLogo} alt="NDM Logo" className="logo" style={{ marginLeft: '30px' }} />
        </div>
        <h1 className="text-center mb-4">Company Sign In</h1>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert className="my-3" variant="danger" style={{ textAlign: 'center' }}>
              {error}
            </Alert>
          )}
          <center>
            <Form.Group className="mb-3 w-50" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 w-50" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </Form.Group>
          </center>

          <Button variant="primary" type="submit" className="my-3">
            Submit
          </Button>
          <p className="text-center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <p className="text-center">
            Don't have an account? <Link to="/register">Sign up now</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
