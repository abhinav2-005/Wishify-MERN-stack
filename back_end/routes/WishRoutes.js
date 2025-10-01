const express = require('express');
const Wish = require('../models/Wishmodel');
const auth = require('../middleware/Auth.js');

const router = express.Router();

// GET /api/wishes - Fetch all wishes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id is set by the 'auth' middleware
    const wishes = await Wish.find({ userId: req.user.id }).sort({ wishDate: 1 });
    res.json(wishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching wishes.');
  }
});

// POST /api/wishes/seed - Temporary route to add initial data for a user
router.post('/seed', auth, async (req, res) => {
    try {
        // Clear existing dummy data (optional, but good for reliable testing)
        // await Wish.deleteMany({ userId: req.user.id }); 

        const seedWishes = [
            { userId: req.user.id, name: 'Alice Smith', email: 'alice@test.com', wishType: 'Birthday', wishDate: new Date(new Date().getFullYear() + 1, 0, 15) },
            { userId: req.user.id, name: 'Bob Johnson', email: 'bob@test.com', wishType: 'Anniversary', wishDate: new Date(new Date().getFullYear(), 11, 25) },
        ];

        const newWishes = await Wish.insertMany(seedWishes);
        res.status(201).json({ message: 'Initial data added successfully.', count: newWishes.length });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Seeding failed');
    }
});

module.exports = router;
