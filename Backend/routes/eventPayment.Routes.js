import express from "express";
import { createEventOrder, getAllEventOrders, getEventOrders, verifyEventPayment } from "../controllers/eventPaymentController.js";

const router = express.Router();

router.post("/create-order", createEventOrder);
router.post("/verify-payment", verifyEventPayment);
// ✅ Get all orders for a specific event
router.get("/event/:eventId", getEventOrders);

// ✅ New route (all events combined)
router.get("/all-orders", getAllEventOrders);
export default router;
