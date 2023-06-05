const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const models = require('../models')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// /api/v1/users/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, companyName, position, email, password, phoneNumber } = req.body;

    // Check if email already exists
    const existingUser = await models.User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email address already exists');
    }

    const user = await models.User.create({ firstName, lastName, companyName, position, email, password, phoneNumber });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); // Replace 'your-secret-key' with your own secret key

    res.json({ token }); // Send the token as a response
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('An error occurred during registration');
  }
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error: 'Please include both email and password',
    });
    return;
  }

  models.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          error: 'Invalid email',
        });
        return;
      }

      bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            error: 'An error occurred during sign-in',
          });
          return;
        }

        if (!match) {
          res.status(401).json({
            error: 'Incorrect password',
          });
          return;
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'your-secret-key'); // Replace 'your-secret-key' with your own secret key

        // Send the token and user data as a response
        res.json({ token, user });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: 'An error occurred during sign-in',
      });
    });
});


// Logout
router.get('/logout', (req, res) => {
  // Remove the token from the client-side (e.g., delete the token from local storage or cookie)
  res.json({ success: 'User logged out' });
});

// Get current user
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const user = await models.User.findOne({ _id: req.user.userId }); // Update the query to use req.user.userId
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error retrieving current user:', err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});


// Middleware for authenticating the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => { // Replace 'your-secret-key' with your own secret key
    if (err) {
      return res.status(403).json({ error: 'Token validation failed' });
    }

    // Set the authenticated user's information in the request object
    req.user = user;
    next();
  });
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdaiuto29@gmail.com', // Replace with your email
    pass: 'vmacyknfeyyfgjul' // Replace with your password
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hour expiration

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const mailOptions = {
      from: 'jdaiuto29@gmail.com', // Replace with your email
      to: email,
      subject: 'Reset Password',
      text: `To reset your password, please click on the following link: 
      http://localhost:3001/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ error: 'An error occurred. Please try again.' });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error('Error processing forgot password request:', err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const {token} = req.params

  try {
    const user = await models.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [models.Sequelize.Op.gt]: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});



module.exports = router;
