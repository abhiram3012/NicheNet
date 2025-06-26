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
      .populate('answers.author', 'username') 
      .sort({ createdAt: -1 });
    
    const formatted = questions.map(q => ({
      id: q._id,
      title: q.title,
      content: q.content,
      author: q.author.username,
      upvotes: q.upvotes,
      downvotes: q.downvotes,
      answersCount: q.answers.length,
      timePosted: q.createdAt,
      isCreator: req.user.id === q.author._id.toString(),
      answers: q.answers.map(a => ({
        id: a._id,
        content: a.content,
        author: a.author.username,
        upvotes: a.upvotes,
        downvotes: a.downvotes,
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

const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Answer content is required." });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    const newAnswer = {
      content,
      author: req.user.id,
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json({ message: "Answer posted successfully." });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/questions/:id
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate('author', 'username').populate('answers.author', 'username') ;
    if (!question) return res.status(404).json({ message: 'Not found' });
    const formatted = {
      id: question._id,
      title: question.title,
      content: question.content,
      author: question.author.username,
      upvotes: question.upvotes,
      downvotes: question.downvotes,
      answersCount: question.answers.length,
      timePosted: question.createdAt,
      isCreator: req.user.id === question.author._id.toString(),
      answers: question.answers.map(a => ({
        id: a._id,
        content: a.content,
        author: a.author.username,
        upvotes: a.upvotes,
        downvotes: a.downvotes,
        timePosted: a.createdAt
      }))
    };
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createQuestion,
    getHubQuestions,
    getUserQuestions,
    answerQuestion,
    getQuestionById
};