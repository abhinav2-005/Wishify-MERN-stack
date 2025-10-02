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


// =================================================================
// ====> 🛑 NEW ROUTE ADDED TO FIX THE 404 ERROR 🛑 <====
// =================================================================
// POST /api/wishes - Create a new wish for the authenticated user
router.post('/', auth, async (req, res) => {
  try {
    // Destructure the expected fields from the request body
    const { name, email, wishType, wishDate } = req.body;

    // Basic validation
    if (!name || !email || !wishType || !wishDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newWish = new Wish({
      userId: req.user.id, // Comes from the 'auth' middleware
      name,
      email,
      wishType,
      wishDate,
    });

    const savedWish = await newWish.save();

    res.status(201).json({ message: 'Wish added successfully!', wish: savedWish });

  } catch (err) {
    console.error('Error creating wish:', err.message);
    res.status(500).send('Server Error');
  }
});
// =================================================================
// ... inside routes/WishRoutes.js, after the router.post('/') route

// =================================================================
// ====> 🛑 NEW DELETE ROUTE 🛑 <====
// =================================================================
// DELETE /api/wishes/:id - Delete a wish for the authenticated user
router.delete('/:id', auth, async (req, res) => {
    try {
        const wish = await Wish.findById(req.params.id);

        // Case 1: Wish not found
        if (!wish) {
            return res.status(404).json({ message: 'Wish not found.' });
        }

        // Case 2: User doesn't own this wish
        // Ensure the user ID from the wish document is compared to the user ID from the token
        if (wish.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this wish.' });
        }

        // If checks pass, delete the wish
        await Wish.findByIdAndDelete(req.params.id);

        res.json({ message: 'Wish deleted successfully.' });

    } catch (err) {
        console.error('Error deleting wish:', err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/wishes/seed - Temporary route to add initial data for a user

module.exports = router;