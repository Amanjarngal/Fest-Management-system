import express from "express";
import {
  getLeaderboard,
  toggleLeaderboard,
  scheduleLeaderboard,
  getLeaderboardStatus,
} from "../controllers/leaderboard.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public: Get leaderboard (top 3 + all participants)
router.get("/", getLeaderboard);

// Admin: Get current leaderboard status
router.get("/status", verifyToken, requireAdmin, getLeaderboardStatus);

// Admin: Toggle leaderboard live status
router.post("/toggle", verifyToken, requireAdmin, toggleLeaderboard);

// Admin: Schedule leaderboard reveal
router.post("/schedule", verifyToken, requireAdmin, scheduleLeaderboard);

export default router;
