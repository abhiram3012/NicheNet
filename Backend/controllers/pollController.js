const Poll = require('../models/Poll');

const createPoll = async (req, res) => {
  const { title, options } = req.body;
  const { hubId } = req.params;

  try {
    const poll = await Poll.create({
      title,
      hub: hubId,
      author: req.user.id,
      options: options.map(text => ({ text })),
      voters: []
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const votePoll = async (req, res) => {
  const { pollId } = req.params;
  const { optionText } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const selectedOption = poll.options.find(opt => opt.text === optionText);
    if (!selectedOption) return res.status(404).json({ message: 'Option not found' });

    // Check if the user has already voted
    const existingVoteIndex = poll.voters.findIndex(
      voter => voter.userId.toString() === req.user.id
    );

    if (existingVoteIndex !== -1) {
      const previousOptionText = poll.voters[existingVoteIndex].optionText;

      if (previousOptionText === optionText) {
        return res.status(400).json({ message: 'You already voted for this option' });
      }

      // Decrement previous vote
      const previousOption = poll.options.find(opt => opt.text === previousOptionText);
      if (previousOption) {
        previousOption.votes = Math.max(0, previousOption.votes - 1);
      }

      // Update to new option
      poll.voters[existingVoteIndex].optionText = optionText;
    } else {
      // New vote
      poll.voters.push({ userId: req.user.id, optionText });
    }

    // Increment vote on new option
    selectedOption.votes++;

    await poll.save();
    res.json(poll);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHubPolls = async (req, res) => {
  const { hubId } = req.params;
  try {
    const polls = await Poll.find({ hub: hubId }).populate('author', 'username');
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserPolls = async (req, res) => {
  try {
    const polls = await Poll.find({
      hub: req.params.hubId,
      author: req.params.userId
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(polls.map(p => ({
      id: p._id,
      title: p.title,
      totalVotes: p.totalVotes,
      timePosted: p.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createPoll,
    votePoll,
    getHubPolls,
    getUserPolls
};