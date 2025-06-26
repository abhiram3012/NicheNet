const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createPost,
  getPostsInHub,
  getPostById,
  likePost,
  dislikePost,
  getUserHubPosts,
} = require('../controllers/postController');

// Create a post in a hub
router.post('/create',authenticate,upload.single('image'), createPost);

// Get all posts in a hub
router.get('/hub/:hubId',authenticate, getPostsInHub);

// Get a single post
router.get('/:postId',authenticate, getPostById);

// Like a post
router.post('/:postId/like',authenticate, likePost);

// Dislike a post
router.post('/:postId/dislike',authenticate, dislikePost);

// Get all posts by a user in a specific hub
router.get('/hub/:hubId/user/:userId', authenticate, getUserHubPosts);

module.exports = router;
