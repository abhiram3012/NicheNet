const express = require('express');
const { createPoll, votePoll, getHubPolls } =  require('../controllers/pollController.js');
const authenticate = require('../middleware/auth.js');

const router = express.Router();

router.post('/:hubId', authenticate, createPoll);
router.put('/:pollId/vote', authenticate, votePoll);
router.get('/hub/:hubId', authenticate, getHubPolls);

module.exports =  router;
