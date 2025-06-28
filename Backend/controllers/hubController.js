const User = require('../models/User');
const Post = require('../models/Post'); // assuming Post model exists
const Hub = require('../models/hub');

// Create new hub
const createHub = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const creator = req.user.id;

    const newHub = new Hub({
      name,
      description,
      isPrivate: isPrivate || false,
      creator,
      members: [creator],
      admins: [creator],
    });

    await newHub.save();

    await User.findByIdAndUpdate(creator, {
      $push: { joinedHubs: newHub._id, createdHubs: newHub._id },
    });

    res.status(201).json(newHub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create hub' });
  }
};

// Get all hubs created by the user
const getUserCreatedHubs = async (req, res) => {
  try {
    const userId = req.user.id;
    const hubs = await Hub.find({ creator: userId });
    res.status(200).json(hubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch created hubs' });
  }
};

// Get all public hubs
const getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find({ isPrivate: false }).select('-__v');
    res.json(hubs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hubs' });
  }
};

const getHubById = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.hubId)
      .populate('members', 'username')
      .select('-__v');
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    let status = 'not_joined';
    if (req.user && req.user.id) {
      const userId = req.user.id;
      if (hub.members.some(member => member._id.toString() === userId)) {
        status = 'joined';
      } else if (hub.pendingRequests.some(id => id.toString() === userId)) {
        status = 'requested';
      }
    }

    res.json({
      ...hub.toObject(),
      status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hub' });
  }
};

// Suggest public hubs that the user hasn't joined yet
const getHubSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('joinedHubs');

    const suggestedHubs = await Hub.find({
      _id: { $nin: user.joinedHubs },
      isPrivate: false,
    }).select('name description tags members bannerUrl');

    res.json(suggestedHubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hub suggestions' });
  }
};

// Join public hub
const joinHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const hub = await Hub.findById(req.params.hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    if (hub.isPrivate) return res.status(403).json({ error: 'This hub is private. Send a join request.' });

    if (!hub.members.includes(userId)) {
      hub.members.push(userId);
      await hub.save();
      await User.findByIdAndUpdate(userId, { $push: { joinedHubs: hub._id } });
    }

    res.json({ message: 'Joined hub successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join hub' });
  }
};

// Leave hub
const leaveHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const hub = await Hub.findById(req.params.hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    hub.members = hub.members.filter(id => id.toString() !== userId);
    await hub.save();

    await User.findByIdAndUpdate(userId, { $pull: { joinedHubs: hub._id } });

    res.json({ message: 'Left the hub successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to leave hub' });
  }
};

// Request to join private hub
const requestToJoinPrivateHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const hub = await Hub.findById(req.params.hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    if (!hub.isPrivate) return res.status(400).json({ error: 'This hub is public. Join directly.' });

    if (!hub.pendingRequests.includes(userId)) {
      hub.pendingRequests.push(userId);
      await hub.save();
    }
    console.log(`User ${userId} requested to join hub ${hub._id}`);
    res.json({ message: 'Request sent to join hub' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request join' });
  }
};

// Approve join request (admin only)
const approveJoinRequest = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { hubId, userId } = req.params;
    const hub = await Hub.findById(hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    if (!hub.admins.map(id => id.toString()).includes(adminId))
      return res.status(403).json({ error: 'Only admins can approve requests' });

    if (!hub.pendingRequests.includes(userId)) {
      return res.status(400).json({ error: 'User did not request to join' });
    }

    hub.members.push(userId);
    hub.pendingRequests = hub.pendingRequests.filter(id => id.toString() !== userId);
    await hub.save();

    await User.findByIdAndUpdate(userId, { $push: { joinedHubs: hub._id } });

    res.json({ message: 'User added to hub' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve request' });
  }
};

// Reject join request (admin only)
const rejectJoinRequest = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { hubId, userId } = req.params;
    const hub = await Hub.findById(hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    if (!hub.admins.map(id => id.toString()).includes(adminId))
      return res.status(403).json({ error: 'Only admins can reject requests' });

    hub.pendingRequests = hub.pendingRequests.filter(id => id.toString() !== userId);
    await hub.save();

    res.json({ message: 'Join request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject request' });
  }
};

// Get pending join requests
const getPendingJoinRequests = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.hubId).populate('pendingRequests', 'username');
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    res.json(hub.pendingRequests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch join requests' });
  }
};

// Get members
const getHubMembers = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.hubId).populate('members', 'username');
    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    res.json(hub.members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

// Get hub overview stats
const getHubOverviewStats = async (req, res) => {
  try {
    const hubId = req.params.hubId;
    const hub = await Hub.findById(hubId);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    const totalPosts = await Post.countDocuments({ hub: hubId });

    res.json({
      name: hub.name,
      totalMembers: hub.members.length,
      totalPosts,
      pendingJoinRequests: hub.pendingRequests.length,
      createdAt: hub.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overview stats' });
  }
};

// Delete hub
const deleteHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const userId = req.user.id;

    const hub = await Hub.findById(hubId);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    if (hub.creator.toString() !== userId)
      return res.status(403).json({ error: 'Only the creator can delete this hub' });

    await Hub.findByIdAndDelete(hubId);
    await Post.deleteMany({ hub: hubId });

    res.json({ message: 'Hub deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hub' });
  }
};

// Update hub banner
const updateHubBanner = async (req, res) => {
  try {
    const hubId = req.params.hubId;
    const userId = req.user.id;

    const hub = await Hub.findById(hubId);
    if (!hub) return res.status(404).json({ error: 'Hub not found' });

    if (hub.creator.toString() !== userId)
      return res.status(403).json({ error: 'Only the creator can update the banner' });

    if (!req.file)
      return res.status(400).json({ error: 'No banner image uploaded' });

    const bannerUrl = `/uploads/posts/${req.file.filename}`;
    hub.bannerUrl = bannerUrl;
    await hub.save();

    res.json({ bannerUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

module.exports = {
  createHub,
  getAllHubs,
  getHubById,
  joinHub,
  leaveHub,
  requestToJoinPrivateHub,
  approveJoinRequest,
  rejectJoinRequest,
  getUserCreatedHubs,
  getHubSuggestions,
  getPendingJoinRequests,
  getHubMembers,
  getHubOverviewStats,
  deleteHub,
  updateHubBanner,
};
