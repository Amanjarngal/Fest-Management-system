import express from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

import {
  addPerformer,
  getAllPerformers,
  getPerformersByEvent,
  getPerformerById,
  updatePerformer,
  deletePerformer,
} from "../controllers/performerController.js";

const router = express.Router();

// Routes
router.post("/", upload.single("image"), addPerformer);
router.get("/", getAllPerformers);
router.get("/event/:eventId", getPerformersByEvent);
router.get("/:id", getPerformerById);
router.put("/:id", upload.single("image"), updatePerformer);
router.delete("/:id", deletePerformer);

export default router;
