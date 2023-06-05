import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NDMLogo from '../assets/NDM_logo.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/v1/users/reset-password/${token}`, { password });
      setSuccess(true);
      setError('');

      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
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
          <span style={{ color: getPasswordValidationColor(password.length >= 8) }}>✓</span> Minimum 8 characters
        </p>
        <p>
          <span style={{ color: getPasswordValidationColor(/[A-Z]/.test(password)) }}>✓</span> Uppercase letter
        </p>
        <p>
          <span style={{ color: getPasswordValidationColor(/[a-z]/.test(password)) }}>✓</span> Lowercase letter
        </p>
        <p>
          <span style={{ color: getPasswordValidationColor(/[0-9]/.test(password)) }}>✓</span> Digit (number)
        </p>
        <p>
          <span style={{ color: getPasswordValidationColor(/[!@#$%^&*]/.test(password)) }}>✓</span> Special character
        </p>
      </div>
    );
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <img src={NDMLogo} alt="NDM Logo" className="logo" />
        <h2>Reset Password</h2>
        <div className="w-50" style={{marginLeft: '145px'}}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                required
                style={{
                  borderColor: getPasswordValidationColor(isStrongPassword(password)),
                }}
              />
              {showPasswordRequirements && (
                <div className="password-requirements-container">{renderPasswordRequirements()}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {success ? (
              <Alert variant="success">Password reset successfully!</Alert>
            ) : (
              <Button type="submit" disabled={loading} className="mt-3">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
