const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub" },
  upvotes: { type: Number, default: 0 },
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);
