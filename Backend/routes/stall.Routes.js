import express from "express";
import {
  createStall,
  getStalls,
  getStallById,
  deleteStall,
  updateStall,
  generateToken,
  resetTokens,
  addItem,
  deleteItem,
  updateItem,
} from "../controllers/stallController.js";

import { verifyToken } from "../middleware/auth.middleware.js";

import { requireRole } from "../middleware/requireRoles.js";

const router = express.Router();

// 🔒 Admin creates stalls
router.post("/", verifyToken, requireRole("admin"), createStall);
// ✅ Update stall details (Admin only)
router.put("/:id", verifyToken, requireRole("admin"), updateStall);

// Public routes
router.get("/", getStalls);
router.get("/:id", getStallById);

// 🔒 Token + menu operations restricted
router.post("/:id/token", generateToken);
router.post("/:id/reset", verifyToken, requireRole("admin", "stallOwner"), resetTokens);
router.post("/:id/item", verifyToken, requireRole("admin", "stallOwner"), addItem);
router.delete("/:id/item/:itemId", verifyToken, requireRole("admin", "stallOwner"), deleteItem);
router.put("/:id/item/:itemId", verifyToken, requireRole("admin", "stallOwner"), updateItem);
router.delete("/:id", verifyToken, requireRole("admin"), deleteStall);

export default router;
