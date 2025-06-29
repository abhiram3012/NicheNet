const express = require("express");
const { createQuestion, getHubQuestions, getUserQuestions, answerQuestion, getQuestionById, upvoteQuestion, downvoteQuestion, upvoteAnswer, downvoteAnswer } = require("../controllers/questionController.js");
const authenticate = require("../middleware/auth.js");

const router = express.Router();

router.post("/hub/:hubId", authenticate, createQuestion);
router.get("/hub/:hubId", authenticate, getHubQuestions);
router.get("/hub/:hubId/user/:userId", authenticate, getUserQuestions);
router.post('/:questionId/answers', authenticate, answerQuestion);
router.get('/:questionId', authenticate, getQuestionById);

router.post('/:questionId/upvote', authenticate, upvoteQuestion);
router.post('/:questionId/downvote', authenticate, downvoteQuestion);

router.post('/:questionId/answers/:answerId/upvote', authenticate, upvoteAnswer);
router.post('/:questionId/answers/:answerId/downvote', authenticate, downvoteAnswer);


module.exports = router;
