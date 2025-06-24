const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByPost,
  likeComment,
  dislikeComment
} = require('../controllers/commentController');

// Add a new comment to a post
router.post('/', addComment);

// Get all comments for a post
router.get('/post/:postId', getCommentsByPost);

// Like a comment
router.post('/:commentId/like', likeComment);

// Dislike a comment
router.post('/:commentId/dislike', dislikeComment);

module.exports = router;
