import express from "express";
import multer from "multer";
import { addEvent, getEvents, deleteEvent, editEvent, getEventById } from "../controllers/eventController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), addEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);
router.put("/:id", upload.single("image"), editEvent); // ✏️ Update event
router.get("/:id", getEventById);


export default router;
