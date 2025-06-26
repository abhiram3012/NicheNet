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
    const post = await Post.findById(req.params.postId).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId); // remove if previously disliked
    }

    await post.save();
    res.json({ message: 'Post liked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Dislike a post
const dislikePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(id => id.toString() !== userId); // remove if previously liked
    }

    await post.save();
    res.json({ message: 'Post disliked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to dislike post' });
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
