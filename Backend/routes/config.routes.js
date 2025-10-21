const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");
const { setVotingLive, getVotingStatus } = require("../controllers/config.controller");

// ✅ Public route — get current status
router.get("/status", getVotingStatus);

// ✅ Admin-only — toggle voting live/unlive
router.post("/toggle/live", verifyToken, requireAdmin, setVotingLive);

module.exports = router;
