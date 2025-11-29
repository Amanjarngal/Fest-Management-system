import express from "express";
import { allotEventTicket, createEventOrder, getAllEventOrders, getEventOrders, getUserOrders, verifyEventPayment } from "../controllers/eventPaymentController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRoles.js";

const router = express.Router();
router.get("/user-orders/:uid", getUserOrders);

router.post("/create-order", createEventOrder);
router.post("/verify-payment", verifyEventPayment);
// ✅ Get all orders for a specific event
router.get("/event/:eventId", getEventOrders);

// ✅ New route (all events combined)
router.get("/all-orders", getAllEventOrders);
router.put(
  "/allot/:orderId",
  verifyToken,
  requireRole("admin"),
  allotEventTicket
);

export default router;
