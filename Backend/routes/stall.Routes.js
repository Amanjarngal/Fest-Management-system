import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

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

// ✅ Cloudinary storage setup for stalls & items
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fest_stalls", // your Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// ✅ Router instance
const router = express.Router();

/* ---------------------------- 🔧 STALL ROUTES ---------------------------- */

// 🏪 Create a new stall (Admin only) — supports image upload
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  upload.single("image"), // ✅ Upload stall image
  createStall
);

// 🏪 Update an existing stall (Admin only) — supports image upload
router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  upload.single("image"), // ✅ Upload updated stall image
  updateStall
);

// 🔐 Get logged-in stall owner's stalls
router.get("/my-stalls", verifyToken, getMyStalls);

// 🌍 Public routes
router.get("/", getStalls);
router.get("/:id", getStallById);

// 🎟️ Token-related routes
router.post("/:id/token", generateToken);
router.post("/:id/reset", verifyToken, requireRole("admin", "stallOwner"), resetTokens);

// 🍔 Add a new menu item with image upload
router.post(
  "/:id/item",
  verifyToken,
  requireRole("admin", "stallOwner"),
  upload.single("image"), // ✅ Upload menu item image
  addItem
);

// ✏️ Update existing menu item (optional new image)
router.put(
  "/:id/item/:itemId",
  verifyToken,
  requireRole("admin", "stallOwner"),
  upload.single("image"), // ✅ Upload new image if provided
  updateItem
);

// 🗑️ Delete menu item
router.delete(
  "/:id/item/:itemId",
  verifyToken,
  requireRole("admin", "stallOwner"),
  deleteItem
);

// 🗑️ Delete stall (Admin only)
router.delete("/:id", verifyToken, requireRole("admin"), deleteStall);

// 🛒 Create order (includes payment + OCR verification)
router.post(
  "/:id/order",
  verifyToken,
  upload.single("paymentScreenshot"),
  createOrder
);

export default router;
