const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { castVote, getVotes, getUserVotes, getVotingStats } = require("../controllers/vote.controller");
const { setVotingLive } = require("../controllers/config.controller");
const requireAdmin = require("../middleware/admin.middleware");

router.post("/:participantId", verifyToken, castVote);
// Get votes of all participants
router.get("/all", getVotes );
router.get("/user", verifyToken, getUserVotes);
router.get("/", getVotingStats);

module.exports = router;
