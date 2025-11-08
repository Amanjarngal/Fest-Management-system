import express from "express";
const router = express.Router();
import {
  createParticipant,
  editParticipant,
  deleteParticipant,
  listParticipants,
} from "../controllers/participant.controller.js";
import { verifyToken }from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

router.get("/", listParticipants);
router.post("/", verifyToken, requireAdmin, createParticipant);
router.put("/:id", verifyToken, requireAdmin, editParticipant);
router.delete("/:id", verifyToken, requireAdmin, deleteParticipant);

export default router;
