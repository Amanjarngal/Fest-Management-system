const express = require("express");
const router = express.Router();
const { createParticipant, editParticipant, deleteParticipant, listParticipants } = require("../controllers/participant.controller");
const verifyToken = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

router.get("/", listParticipants);
router.post("/", verifyToken, requireAdmin, createParticipant);
router.put("/:id", verifyToken, requireAdmin, editParticipant);
router.delete("/:id", verifyToken, requireAdmin, deleteParticipant);

module.exports = router;
