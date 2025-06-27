const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment (or reply)
const addComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const userId = req.user.id;

    // 1. Create the comment
    const newComment = new Comment({
      content,
      author: userId,
      post: postId,
      parentComment: parentCommentId || null,
    });

    await newComment.save();

    // 2. Push the comment ID to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    // 3. Return the created comment
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};


// Get all comments for a post (with nested replies)
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { parentCommentId } = req.query;

    // Build query
    const query = { post: postId };
    if (parentCommentId) {
      query.parentComment = parentCommentId;  // fetch only replies to that comment
    } else {
      query.parentComment = null; // fetch only root comments if no parentCommentId specified
    }

    const comments = await Comment.find(query)
      .populate('author', 'username')  // fixed from createdBy to author (matches your schema)
      .lean();

    res.json(comments);
  } catch (err) {
    console.error(err);
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
