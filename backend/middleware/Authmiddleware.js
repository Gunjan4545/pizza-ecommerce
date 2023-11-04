const jwt = require('jsonwebtoken');
// const config = require('./config'); // Configuration file for secret key and other settings
const config = require('../config');

const verifyToken = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the authorization header

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the token from the "Authorization" header by splitting it
  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
    if (err) {
      console.log('JWT Verification Error:', err);
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Access the user ID and role from the decoded token
    const userId = decodedToken._id;
    const userRole = decodedToken.role;

    // Check if the user has the required role
    if (userRole === requiredRole) {
      // Attach the user ID to the request object for use in subsequent route handlers
      req.user = userId;
      req.userRole = userRole;
      console.log('User Data Attached to req.user:', req.user);

      next(); // User has the required role, allow access to the route
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  });
};
module.exports = {
  verifyToken
};