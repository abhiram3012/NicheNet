const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUsername, updateBio, updatePassword } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route to get current logged in user
router.get('/me', authenticate, getMe);
router.put('/me/username', authenticate, updateUsername);
router.put('/me/bio', authenticate, updateBio);
router.put('/me/password', authenticate, updatePassword);

module.exports = router;
