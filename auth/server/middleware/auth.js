const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'NO_TOKEN' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        error: 'USER_NOT_FOUND' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expired',
        error: 'EXPIRED_TOKEN' 
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Server error during authentication',
      error: 'SERVER_ERROR' 
    });
  }
};

module.exports = { authenticateToken };