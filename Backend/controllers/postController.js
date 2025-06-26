const Post = require('../models/Post');
const Hub = require('../models/Hub');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, hubId, content, isAnonymous } = req.body;
    const userId = req.user.id;

    const hub = await Hub.findById(hubId);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    const post = new Post({
      author: userId,
      title,
      content,
      image: req.file ? `/uploads/posts/${req.file.filename}` : null, // save file path
      createdBy: userId,
      hub: hubId,
      isAnonymous: isAnonymous || false,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};


// Get all posts in a hub
const getPostsInHub = async (req, res) => {
  try {
    const posts = await Post.find({ hub: req.params.hubId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a specific post
const getPostById = async (req, res) => {
  try {

    // Populate both author and hub (to check creator)
    const post = await Post.findById(req.params.postId)
    .populate('author', 'username') // post author
    .populate('hub', 'creator')     // hub creator
    .populate({
      path: 'comments',
      select: 'content author createdAt',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Check if the post author is also the hub creator
    const isCreator = post.author._id.toString() === post.hub.creator.toString();

    // Convert to object and add isCreator field
    const postWithCreatorInfo = {
      ...post.toObject(),
      isCreator
    };

    res.json(postWithCreatorInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (!hasUpvoted) {
      post.upvotes.push(userId);
    }

    if (hasDownvoted) {
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
    }

    await post.save();
    res.json({ message: 'Post upvoted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upvote post' });
  }
};

// Dislike a post
const dislikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const hasDownvoted = post.downvotes.includes(userId);
    const hasUpvoted = post.upvotes.includes(userId);

    if (!hasDownvoted) {
      post.downvotes.push(userId);
    }

    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    }

    await post.save();
    res.json({ message: 'Post downvoted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to downvote post' });
  }
};

// Remove a user's vote (like/dislike) from a post
const removeVote = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    post.downvotes = post.downvotes.filter(id => id.toString() !== userId);

    await post.save();
    res.json({ message: 'Vote removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove vote' });
  }
};

// Get all posts by a user in a specific hub
const getUserHubPosts = async (req, res) => {
  const { hubId, userId } = req.params;
  try {
    const posts = await Post.find({ hub: hubId, author: userId }).populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getPostsInHub,
  getPostById,
  likePost,
  dislikePost,
  getUserHubPosts,
};
