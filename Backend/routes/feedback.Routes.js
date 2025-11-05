import express from "express";
import { addFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", addFeedback); // Add new feedback
router.get("/", getAllFeedback); // Get all feedbacks (Admin dashboard)

export default router;
