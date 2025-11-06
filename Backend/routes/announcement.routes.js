const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAllAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");
const verifyToken = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

// Public: Fetch all announcements
router.get("/", getAllAnnouncements);

// Admin Only: Create, Edit, Delete
router.post("/", verifyToken, requireAdmin, createAnnouncement);
router.put("/:id", verifyToken, requireAdmin, editAnnouncement);
router.delete("/:id", verifyToken, requireAdmin, deleteAnnouncement);

module.exports = router;
