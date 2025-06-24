const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  getUserProfile,
  joinHub,
  leaveHub,
  requestJoinPrivateHub,
  updateUserKarma,
  updateBadgesAndRank,
  getJoinedHubs
} = require('../controllers/userController');

// Get current user's profile
router.get('/me', authenticate, getUserProfile);

router.get('/joined-hubs', authenticate, getJoinedHubs);

// Join a public hub
router.post('/join/:hubId', authenticate, joinHub);

// Leave a hub
router.post('/leave/:hubId', authenticate, leaveHub);

// Request to join private hub
router.post('/request-private/:hubId', authenticate, requestJoinPrivateHub);

// Update karma (admin/mod action or system-based)
router.post('/update-karma', authenticate, updateUserKarma);

// Update badges or rank (e.g., Newbie → Contributor → Expert)
router.post('/update-profile', authenticate, updateBadgesAndRank);

module.exports = router;
