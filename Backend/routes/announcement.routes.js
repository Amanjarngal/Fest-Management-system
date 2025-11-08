import express from "express";
const router = express.Router();
import {
  createAnnouncement,
  getAllAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { verifyToken }  from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

// Public: Fetch all announcements
router.get("/", getAllAnnouncements);

// Admin Only: Create, Edit, Delete
router.post("/", verifyToken, requireAdmin, createAnnouncement);
router.put("/:id", verifyToken, requireAdmin, editAnnouncement);
router.delete("/:id", verifyToken, requireAdmin, deleteAnnouncement);

export default router;
