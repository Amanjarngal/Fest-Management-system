import express from "express";
import { createBookingOrder, getAllBookings, getUserBookings, verifyPayment } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create-order", createBookingOrder);
router.post("/verify-payment", verifyPayment);

router.get("/all", getAllBookings); // Admin view
router.get("/user/:userId", getUserBookings); // User view
export default router;
