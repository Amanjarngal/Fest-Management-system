import express from "express";
import {
  createPayPalOrder,
  capturePayPalPayment,
  getAllBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// 🧾 PayPal routes
router.post("/create-order", createPayPalOrder);
router.post("/capture-payment", capturePayPalPayment);

// 🧾 Bookings data
router.get("/all", getAllBookings);
router.get("/user/:userId", getUserBookings);

export default router;
