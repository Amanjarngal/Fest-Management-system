import express from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./admin.routes.js";
import imageRoute from "./image.Routes.js";
import participantRoutes from "./participant.routes.js"
import voteRoutes from "./vote.routes.js"
import configRoutes from "./config.routes.js";
import leaderboardRoutes from "./leaderboard.routes.js";
import eventRoutes from "./event.Routes.js";
import pricingRoutes from "./pricing.Routes.js";
import bookingRoutes from "./booking.Routes.js";
import performerRoutes from "./performer.Routes.js";
import feedbackRoutes from "./feedback.Routes.js";
import announcementRoutes from "./announcement.routes.js"
import stallRoutes from "./stall.Routes.js"
import stallCartRoutes from "./stallCart.Routes.js"
import eventPaymentRoutes from "./eventPayment.Routes.js";
import stallPaymentRoutes from "./stallPayment.Routes.js";
const router = express.Router();

// ✅ All sub-routes
router.use("/users", userRoutes);   // /api/users
router.use("/admin", adminRoutes);  // /api/admin
router.use("/images", imageRoute);  // /api/images
// routes
router.use("/participants", participantRoutes);
router.use("/votes", voteRoutes);
router.use("/config", configRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/events", eventRoutes);
router.use("/pricing", pricingRoutes);
// router.use("/cart", cartRoutes);
router.use("/bookings", bookingRoutes);
router.use("/performers", performerRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/announcements", announcementRoutes);
router.use("/stalls", stallRoutes);
router.use("/stallCart", stallCartRoutes)
router.use("/razorpay/events", eventPaymentRoutes);
router.use("/razorpay/stalls", stallPaymentRoutes);


export default router;
