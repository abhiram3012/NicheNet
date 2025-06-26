const express = require("express");
const { createQuestion, getHubQuestions, getUserQuestions, answerQuestion, getQuestionById } = require("../controllers/questionController.js");
const authenticate = require("../middleware/auth.js");

const router = express.Router();

router.post("/hub/:hubId", authenticate, createQuestion);
router.get("/hub/:hubId", authenticate, getHubQuestions);
router.get("/hub/:hubId/user/:userId", authenticate, getUserQuestions);
router.post('/:questionId/answers', authenticate, answerQuestion);
router.get('/:questionId', authenticate, getQuestionById);

module.exports = router;
