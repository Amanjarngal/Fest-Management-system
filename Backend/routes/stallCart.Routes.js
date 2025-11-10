import express from "express";
import {
  addStallItemToCart,
  updateStallCartItem,
  deleteStallCartItem,
  getStallCart,
  clearStallCart,
} from "../controllers/stallCartController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require valid Firebase token
router.use(verifyToken);

router.post("/add", addStallItemToCart);
router.put("/update", updateStallCartItem);
router.delete("/delete", deleteStallCartItem);
router.get("/:uid/:stallId", getStallCart);
router.delete("/clear", clearStallCart);

export default router;
