const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// 1. Configuration
const app = express();
const PORT = process.env.PORT || 5000;

// 🛑 UPDATED MONGO_URI FOR LOCAL CONNECTION 🛑
// Connecting to a local MongoDB instance running on the default port (27017)
const MONGO_URI = 'mongodb://127.0.0.1:27017/wishify_db'; 


// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
      console.error('*** FATAL ERROR: MongoDB connection failed! ***');
      console.error('Please ensure your local MongoDB server is running.');
      console.error('Error details:', err.message);
      process.exit(1); // Exit the process if connection fails
  });

// 4. Routes
app.use('/api/users', userRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Wishify MERN Backend is running!');
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});