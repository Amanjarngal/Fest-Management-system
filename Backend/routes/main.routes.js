import express from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./admin.routes.js";
import imageRoute from "./image.Routes.js";
import participantRoutes from "./participant.routes.js"
import voteRoutes from "./vote.routes.js"
import configRoutes from "./config.routes.js";
const router = express.Router();

// ✅ All sub-routes
router.use("/users", userRoutes);   // /api/users
router.use("/admin", adminRoutes);  // /api/admin
router.use("/images", imageRoute);  // /api/images
// routes
router.use("/participants", participantRoutes);
router.use("/votes", voteRoutes);
router.use("/config", configRoutes);


export default router;
