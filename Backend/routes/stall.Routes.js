import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

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
  getMyStalls,
} from "../controllers/stallController.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRoles.js";
import { createOrder } from "../controllers/tokenCartController.js";

const router = express.Router();

/* ------------ STALL ROUTES ------------ */

// Create stall
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  upload.single("image"),
  createStall
);

// Update stall
router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  upload.single("image"),
  updateStall
);

// Get logged-in stall owner's stalls
router.get("/my-stalls", verifyToken, getMyStalls);

// Public routes
router.get("/", getStalls);
router.get("/:id", getStallById);

// Token routes
router.post("/:id/token", generateToken);
router.post("/:id/reset", verifyToken, requireRole("admin", "stallOwner"), resetTokens);

// Add item
router.post(
  "/:id/item",
  verifyToken,
  requireRole("admin", "stallOwner"),
  upload.single("image"),
  addItem
);

// Update item
router.put(
  "/:id/item/:itemId",
  verifyToken,
  requireRole("admin", "stallOwner"),
  upload.single("image"),
  updateItem
);

// Delete item
router.delete(
  "/:id/item/:itemId",
  verifyToken,
  requireRole("admin", "stallOwner"),
  deleteItem
);

// Delete stall
router.delete("/:id", verifyToken, requireRole("admin"), deleteStall);

// Create stall order
router.post(
  "/:id/order",
  verifyToken,
  upload.single("paymentScreenshot"),
  createOrder
);

export default router;
