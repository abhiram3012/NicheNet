const express = require("express");
const { createQuestion, getHubQuestions, getUserQuestions } = require("../controllers/questionController.js");
const authenticate = require("../middleware/auth.js");

const router = express.Router();

router.post("/hub/:hubId", authenticate, createQuestion);
router.get("/hub/:hubId", authenticate, getHubQuestions);
router.get("/hub/:hubId/user/:userId", authenticate, getUserQuestions);

module.exports = router;
