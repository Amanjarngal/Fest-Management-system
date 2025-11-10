import express from "express";
import { createStallOrder, verifyStallPayment } from "../controllers/stallPaymentController.js";
import {verifyToken} from "../middleware/auth.middleware.js"; // ✅ import middleware

const router = express.Router();

// ✅ Protect both routes with Firebase verification
router.post("/create-order", verifyToken, createStallOrder);
router.post("/verify-payment", verifyToken, verifyStallPayment);

export default router;
