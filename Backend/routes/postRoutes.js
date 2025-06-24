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
} = require('../controllers/postController');

// Create a post in a hub
router.post('/create',authenticate,upload.single('image'), createPost);

// Get all posts in a hub
router.get('/hub/:hubId', getPostsInHub);

// Get a single post
router.get('/:postId', getPostById);

// Like a post
router.post('/:postId/like', likePost);

// Dislike a post
router.post('/:postId/dislike', dislikePost);

module.exports = router;
