const Question = require("../models/Question");

// Create a new question in a hub
const createQuestion = async (req, res) => {
  const { title, content } = req.body;
  const hubId = req.params.hubId;
  try {
    const question = new Question({
      title,
      content,
      hub: hubId,
      author: req.user.id
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all questions in a hub
const getHubQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ hub: req.params.hubId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    const formatted = questions.map(q => ({
      id: q._id,
      title: q.title,
      content: q.content,
      author: q.author.username,
      upvotes: q.upvotes,
      answersCount: q.answers.length,
      timePosted: q.createdAt,
      isCreator: req.user.id === q.author._id.toString(),
      answers: q.answers.map(a => ({
        id: a._id,
        content: a.content,
        author: a.author.username,
        upvotes: a.upvotes,
        timePosted: a.createdAt
      }))
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user questions in a hub
const getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      hub: req.params.hubId,
      author: req.params.userId
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    const formatted = questions.map(q => ({
      id: q._id,
      title: q.title,
      content: q.content,
      answersCount: q.answers.length,
      timePosted: q.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createQuestion,
    getHubQuestions,
    getUserQuestions
};