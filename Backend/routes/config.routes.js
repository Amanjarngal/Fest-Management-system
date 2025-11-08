import  express from "express";
const router = express.Router();
import { verifyToken } from"../middleware/auth.middleware.js";
import  { requireAdmin } from "../middleware/admin.middleware.js";
import { setVotingLive, getVotingStatus } from "../controllers/config.controller.js";

// ✅ Public route — get current status
router.get("/status", getVotingStatus);

// ✅ Admin-only — toggle voting live/unlive
router.post("/toggle/live", verifyToken, requireAdmin, setVotingLive);

export default router;
