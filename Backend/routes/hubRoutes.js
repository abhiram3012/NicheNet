const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  createHub,
  getAllHubs,
  getHubById,
  joinHub,
  requestToJoinPrivateHub,
  approveJoinRequest,
  rejectJoinRequest,
  getUserCreatedHubs,
  getHubSuggestions,
  leaveHub,
  getHubOverviewStats,
  getPendingJoinRequests,
  getHubMembers,
  deleteHub,
  updateHubBanner,
} = require('../controllers/hubController');
const upload = require('../middleware/upload');
const hub = require('../models/hub');

// Create a new hub (authenticated users)
router.post('/create', authenticate, createHub);

// Get all public hubs (no auth required)
router.get('/', getAllHubs);

// Get all hubs created by the authenticated user
router.get('/my-created', authenticate, getUserCreatedHubs);

// Get hub suggestions based on user activity (authenticated users)
router.get('/suggestions', authenticate, getHubSuggestions);

// Search hubs by name
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const hubs = await hub.find({
      name: { $regex: query, $options: 'i' } // case-insensitive match
    });
    res.json(hubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hubs' });
  }
});

// Get a single hub by ID (no auth required)
router.get('/:hubId',authenticate, getHubById);

// Join public hub (authenticated users)
router.post('/:hubId/join', authenticate, joinHub);

// Leave a hub (authenticated users)
router.post('/:hubId/leave', authenticate, leaveHub);

// Request to join private hub (authenticated users)
router.post('/:hubId/request', authenticate, requestToJoinPrivateHub);

// Approve request to join private hub (admin only — authenticated)
router.post('/:hubId/approve/:userId', authenticate, approveJoinRequest);

// Reject request to join private hub (admin only — authenticated)
router.post('/:hubId/reject/:userId', authenticate, rejectJoinRequest);

// Get all hubs that the user can join (public and private with pending requests)
router.get('/:hubId/admin/overview', authenticate, getHubOverviewStats);

// Get pending join requests for a private hub (admin only) 
router.get('/:hubId/admin/join-requests', authenticate, getPendingJoinRequests);

// Get members of a hub (admin only)
router.get('/:hubId/admin/members', authenticate, getHubMembers);

// Delete a hub (admin only)
router.delete('/:hubId/admin', authenticate, deleteHub);

// Upload banner (creator only)
router.post('/:hubId/upload-banner', authenticate, upload.single('banner'), updateHubBanner);

module.exports = router;
