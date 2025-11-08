import express from "express";
const router = express.Router();
import { verifyToken} from "../middleware/auth.middleware.js";
import { castVote, getVotes, getUserVotes, getVotingStats } from  "../controllers/vote.controller.js";
// import { setVotingLive } from "../controllers/config.controlle.js";
// import {requireAdmin} from "../middleware/admin.middleware.js";

router.post("/:participantId", verifyToken, castVote);
// Get votes of all participants
router.get("/all", getVotes );
router.get("/user", verifyToken, getUserVotes);
router.get("/", getVotingStats);

export default router;
