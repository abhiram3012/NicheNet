const Comment = require('../models/Comment');

// Add a comment (or reply)
const addComment = async (req, res) => {
  try {
    const { postId, userId, content, parentCommentId, isAnonymous } = req.body;

    const newComment = new Comment({
      content,
      createdBy: userId,
      post: postId,
      isAnonymous: isAnonymous || false,
      parentComment: parentCommentId || null
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get all comments for a post (with nested replies)
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('createdBy', 'username')
      .lean();

    // Organize into threaded structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    comments.forEach(comment => {
      if (comment.parentComment) {
        commentMap[comment.parentComment]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    res.json(rootComments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Like a comment
const likeComment = async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
    }

    await comment.save();
    res.json({ message: 'Comment liked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like comment' });
  }
};

// Dislike a comment
const dislikeComment = async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    }

    await comment.save();
    res.json({ message: 'Comment disliked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to dislike comment' });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  likeComment,
  dislikeComment
};
