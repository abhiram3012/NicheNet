const User = require('../models/User');
const Hub = require('../models/Hub');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('joinedHubs', 'name type');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Get hubs user has joined
const getJoinedHubs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'joinedHubs',
      select: 'name description members creator category bannerUrl imageUrl lastActive activeUsers newPosts',
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.joinedHubs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch joined hubs' });
  }
};



// Join a public hub
const joinHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const user = await User.findById(req.user.id);
    const hub = await Hub.findById(hubId);

    if (!user || !hub) return res.status(404).json({ error: 'User or hub not found' });
    if (hub.type === 'private') return res.status(403).json({ error: 'Hub is private. Send request to join.' });

    if (!user.joinedHubs.includes(hubId)) {
      user.joinedHubs.push(hubId);
      await user.save();
    }

    res.json({ message: 'Joined hub successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join hub' });
  }
};

// Leave a hub
const leaveHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const user = await User.findById(req.user.id);

    user.joinedHubs = user.joinedHubs.filter(id => id.toString() !== hubId);
    await user.save();

    res.json({ message: 'Left hub successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave hub' });
  }
};

// Request to join private hub
const requestJoinPrivateHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const hub = await Hub.findById(hubId);

    if (!hub) return res.status(404).json({ error: 'Hub not found' });
    if (hub.type !== 'private') return res.status(400).json({ error: 'Hub is not private' });

    if (!hub.joinRequests.includes(req.user.id)) {
      hub.joinRequests.push(req.user.id);
      await hub.save();
    }

    res.json({ message: 'Join request sent to admin' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request join' });
  }
};

// Update user karma (used by system or mods)
const updateUserKarma = async (req, res) => {
  try {
    const { change } = req.body; // e.g., +5 or -3
    const user = await User.findById(req.user.id);

    user.karma += change;
    await user.save();

    res.json({ message: 'Karma updated', karma: user.karma });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update karma' });
  }
};

// Update badges or profile rank (used by system/admin)
const updateBadgesAndRank = async (req, res) => {
  try {
    const { badges, profileRank } = req.body;
    const user = await User.findById(req.user.id);

    if (badges) user.badges = badges;
    if (profileRank) user.profileRank = profileRank;

    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  getUserProfile,
  joinHub,
  leaveHub,
  requestJoinPrivateHub,
  updateUserKarma,
  updateBadgesAndRank,
  getJoinedHubs
};
