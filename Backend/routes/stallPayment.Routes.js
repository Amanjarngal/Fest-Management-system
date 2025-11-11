import express from "express";
import { createStallOrder, getStallOrders, verifyStallPayment } from "../controllers/stallPaymentController.js";
import {verifyToken} from "../middleware/auth.middleware.js"; // ✅ import middleware

const router = express.Router();

// ✅ Protect both routes with Firebase verification
router.post("/create-order", verifyToken, createStallOrder);
router.post("/verify-payment", verifyToken, verifyStallPayment);
// ✅ Get all orders for a specific stall
router.get("/stall/:stallId", verifyToken, getStallOrders);

export default router;
