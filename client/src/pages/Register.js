import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../redux/reducers/userReducer';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import NDMLogo from '../assets/NDM_logo.png';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    position: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (name === 'password') {
      setShowPasswordRequirements(value.length > 0 && !isStrongPassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user.password !== user.confirmPassword) {
        // Handle password mismatch error
        setAlert({ type: 'danger', message: 'Passwords do not match' });
        return;
      }

      if (!isStrongPassword(user.password)) {
        // Handle weak password error
        setAlert({ type: 'danger', message: 'Password must be strong' });
        return;
      }

      const response = await axios.post('/api/v1/users/register', user);
      const responseData = response.data;

      // Save the JWT token in local storage or a cookie
      localStorage.setItem('token', responseData.token);
      dispatch(loggedIn(responseData)); // Dispatch the loggedIn action with the response data
      setAlert({ type: 'success', message: 'Registration successful' });
      navigate('/sign-in');

      // Reset form values
      setUser({
        firstName: '',
        lastName: '',
        companyName: '',
        position: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
      });
    } catch (err) {
      console.error('Error registering user:', err.response);
      if (err.response && err.response.status === 400) {
        setAlert({ type: 'danger', message: err.response.data });
      } else {
        setAlert({ type: 'danger', message: 'An error occurred during registration' });
      }
    }
  };

  const isStrongPassword = (password) => {
    // Add your strong password validation logic here
    // Example: Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const getPasswordValidationColor = (requirementMet) => {
    return requirementMet ? 'green' : 'red';
  };

  const renderPasswordRequirements = () => {
    return (
      <div className="password-requirements">
        <p>
          <span
            style={{ color: getPasswordValidationColor(user.password.length >= 8) }}
          >
            ✓
          </span>{' '}
          Minimum 8 characters
        </p>
        <p>
          <span
            style={{
              color: getPasswordValidationColor(/[A-Z]/.test(user.password)),
            }}
          >
            ✓
          </span>{' '}
          Uppercase letter
        </p>
        <p>
          <span
            style={{
              color: getPasswordValidationColor(/[a-z]/.test(user.password)),
            }}
          >
            ✓
          </span>{' '}
          Lowercase letter
        </p>
        <p>
          <span
            style={{
              color: getPasswordValidationColor(/[0-9]/.test(user.password)),
            }}
          >
            ✓
          </span>{' '}
          Digit (number)
        </p>
        <p>
          <span
            style={{
              color: getPasswordValidationColor(/[!@#$%^&*]/.test(user.password)),
            }}
          >
            ✓
          </span>{' '}
          Special character
        </p>
      </div>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Send the token in the Authorization header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(loggedIn());
    }
  }, [dispatch]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container bg-white p-5 w-50">
        <Row className="mb-4">
          <Col className="text-center">
            <img src={NDMLogo} alt="NDM Logo" className="logo" />
          </Col>
        </Row>
        <h1 className="text-center mb-4">Company Registration</h1>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="companyName" className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={user.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="position" className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={user.position}
                  onChange={handleInputChange}
                  placeholder="Enter your position"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                  placeholder="Enter your password"
                  required
                  style={{
                    borderColor: getPasswordValidationColor(isStrongPassword(user.password)),
                  }}
                />
                {showPasswordRequirements && (
                  <div className="password-requirements-container">
                    {renderPasswordRequirements()}
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </Form.Group>

              <Form.Group controlId="phoneNumber" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {alert.message && <Alert className={'mb-3 mt-3'} variant={alert.type}>{alert.message}</Alert>}
          <Button variant="primary" type="submit" className="mt-3">
            Register
          </Button>
          <p className="text-center mt-3">
            Already have an account? <Link to="/sign-in">Sign in now</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;
