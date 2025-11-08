import express from "express";
import { getAdmins, makeAdmin, removeAdmin } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only an existing admin can make another admin
router.post("/make-admin", verifyToken, requireAdmin, makeAdmin);
router.get("/list-admins", verifyToken, requireAdmin, getAdmins);
router.post("/remove-admin", verifyToken, requireAdmin, removeAdmin);

export default router;
