import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NDMLogo from '../assets/NDM_logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/users/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting forgot password request:', err.response);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container bg-white p-5 w-50">
        <div className="text-start mb-4">
          <img src={NDMLogo} alt="NDM Logo" className="logo" style={{ marginLeft: '30px' }} />
        </div>
        <h1 className="text-center mb-4">Forgot Password</h1>
        {success ? (
          <p className="text-center">
            Password reset email has been sent to your email address. Please check your inbox.
          </p>
        ) : (
          <>
            {error && (
              <Alert className="my-3" variant="danger" style={{ textAlign: 'center' }}>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 w-50" controlId="formBasicEmail" style={{ marginLeft: '165px' }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="my-3">
                Submit
              </Button>
            </Form>
            <p className="text-center">
              <Link to="/home">Go Back Home</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
