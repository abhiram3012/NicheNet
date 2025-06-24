const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '7d' }
  );
};

// Register user with password
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Username and password are required' });

    // Check if username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(409).json({ error: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword, // store hashed password
      isAnonymous: false
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ message: 'Login successful', user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current logged in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v -password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
