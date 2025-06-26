const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByPost,
  likeComment,
  dislikeComment
} = require('../controllers/commentController');
const authenticate = require('../middleware/auth');

// Add a new comment to a post
router.post('/',authenticate, addComment);

// Get all comments for a post
router.get('/post/:postId',authenticate, getCommentsByPost);

// Like a comment
router.post('/:commentId/like',authenticate, likeComment);

// Dislike a comment
router.post('/:commentId/dislike',authenticate, dislikeComment);

module.exports = router;
