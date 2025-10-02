const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const userRoutes = require('./routes/userRoutes');
const wishRoutes = require('./routes/WishRoutes');

// --- 1. Configuration & Environment Variables ---
const app = express();
// Use the PORT from .env, or default to 5000
const PORT = process.env.PORT || 5000; 
// Use the MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI; 

// A check to ensure MONGO_URI is loaded
if (!MONGO_URI) {
    console.error('*** FATAL ERROR: MONGO_URI is not defined in .env file ***');
    process.exit(1);
}

// --- 2. Middleware ---
app.use(cors());
app.use(express.json());

// --- 3. MongoDB Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
      console.error('*** FATAL ERROR: MongoDB connection failed! ***');
      console.error('Please ensure your local MongoDB server is running.');
      console.error('Error details:', err.message);
      process.exit(1); // Exit the process if connection fails
  });

// --- 4. Routes ---
app.use('/api/users', userRoutes);
app.use('/api/wishes', wishRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Wishify MERN Backend is running!');
});

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});