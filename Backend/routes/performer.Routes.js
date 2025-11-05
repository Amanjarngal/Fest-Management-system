import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  addPerformer,
  getAllPerformers,
  getPerformersByEvent,
  getPerformerById,
  updatePerformer,
  deletePerformer,
} from "../controllers/performerController.js";

const router = express.Router();

// ✅ Cloudinary storage for performer images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "performers", // your Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addPerformer);
router.get("/", getAllPerformers);
router.get("/event/:eventId", getPerformersByEvent);
router.get("/:id", getPerformerById);
router.put("/:id", upload.single("image"), updatePerformer);
router.delete("/:id", deletePerformer);

export default router;
