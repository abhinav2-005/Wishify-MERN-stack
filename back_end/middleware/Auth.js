const jwt = require('jsonwebtoken');

// 🛑 IMPORTANT: Secret key loaded from .env file via server.js setup
const JWT_SECRET = process.env.JWT_SECRET || 'a_default_secret_key_for_dev'; 

const auth = (req, res, next) => {
  // Get token from header (usually sent as 'Bearer TOKEN')
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user object (including id) to the request
    req.user = decoded.user; 
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
