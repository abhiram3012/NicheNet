const jwt = require('jsonwebtoken');

// Secret key for JWT (store this in .env in real apps)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to verify token and extract user info
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
