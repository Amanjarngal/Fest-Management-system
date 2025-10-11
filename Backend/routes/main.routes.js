import express from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

// ✅ All sub-routes
router.use("/users", userRoutes);   // /api/users
router.use("/admin", adminRoutes);  // /api/admin

export default router;
