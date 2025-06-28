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

      if (previousOptionText !== optionText) {
        // Change vote: decrement old, increment new
        const previousOption = poll.options.find(opt => opt.text === previousOptionText);
        if (previousOption) {
          previousOption.votes = Math.max(0, previousOption.votes - 1);
        }
        poll.voters[existingVoteIndex].optionText = optionText;
        selectedOption.votes++;
      }
      // else: same option re-voted, do nothing but still send poll data back
    } else {
      // New vote
      poll.voters.push({ userId: req.user.id, optionText });
      selectedOption.votes++;
    }

    await poll.save();

    // Calculate total votes and percentages
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const optionsWithPercentage = poll.options.map(opt => ({
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes === 0 ? 0 : ((opt.votes / totalVotes) * 100).toFixed(1)
    }));

    res.json({
      pollId: poll._id,
      title: poll.title,
      author: poll.author.username,
      options: optionsWithPercentage,
      totalVotes,
      createdAt: poll.createdAt,
      userVotedOption: optionText
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getHubPolls = async (req, res) => {
  const { hubId } = req.params;
  try {
    const polls = await Poll.find({ hub: hubId }).populate('author', 'username');

    const formattedPolls = polls.map(poll => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
      const optionsWithPercentage = poll.options.map(opt => ({
        text: opt.text,
        votes: opt.votes,
        percentage: totalVotes === 0 ? 0 : ((opt.votes / totalVotes) * 100).toFixed(1)
      }));

      return {
        pollId: poll._id,
        title: poll.title,
        author: poll.author.username,
        options: optionsWithPercentage,
        totalVotes,
        createdAt: poll.createdAt,
        voters: poll.voters // optional: can remove or keep if frontend uses it
      };
    });

    res.json(formattedPolls);
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

    const formattedPolls = polls.map(p => {
      const totalVotes = p.options.reduce((sum, opt) => sum + opt.votes, 0);

      return {
        pollId: p._id,
        title: p.title,
        totalVotes,
        createdAt: p.createdAt,
        options: p.options.map(opt => ({
          text: opt.text,
          votes: opt.votes,
          percentage: totalVotes === 0 ? 0 : ((opt.votes / totalVotes) * 100).toFixed(1)
        })),
        isCreator: p.author._id.toString() === req.user.id,
      };
    });

    res.json(formattedPolls);
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