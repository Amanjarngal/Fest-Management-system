import express from "express";
import {
  createImage,
  getImages,
  updateImage,
  deleteImage,
} from "../controllers/imageController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create (Admin Upload)
router.post("/", upload.single("image"), createImage);

// Read (Fetch All)
router.get("/", getImages);

// Update
router.put("/:id", upload.single("image"), updateImage);

// Delete
router.delete("/:id", deleteImage);

export default router;
