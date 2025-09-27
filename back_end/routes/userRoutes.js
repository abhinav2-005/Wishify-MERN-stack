const express = require('express');
const User = require('../models/user');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user (password will be hashed by the pre-save hook)
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Send success response
    res.status(201).json({ 
        message: 'User registered successfully',
        user: { 
            id: newUser._id, 
            username: newUser.username, 
            email: newUser.email 
        } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

module.exports = router;