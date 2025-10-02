const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// 🛑 IMPORTANT: JWT_SECRET loaded via dotenv setup in server.js
const JWT_SECRET = process.env.JWT_SECRET || 'a_default_secret_key_for_dev'; 

// POST /api/users/signup (Registration)
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    // After registration, log them in immediately by generating a token
    const payload = {
        user: { id: newUser.id }
    };
    
    jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '5h' }, // Token expiration
        (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, message: 'User registered successfully.' });
        }
    );

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// POST /api/users/login (Authentication)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter both email and password.' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // comparePassword method is defined in User model
        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // User is authenticated, create JWT
        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token, message: 'Login successful.' });
            }
        );

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});
// ... in routes/userRoutes.js

const auth = require('../middleware/Auth.js'); // 🛑 Make sure auth middleware is imported

// ... after the '/login' route

// =================================================================
// ====> 🛑 NEW ROUTE TO GET CURRENT USER'S DATA 🛑 <====
// =================================================================
// GET /api/users/me - Get logged in user's data
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is attached by the 'auth' middleware
    // Find the user but exclude the password field for security
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
module.exports = router;
