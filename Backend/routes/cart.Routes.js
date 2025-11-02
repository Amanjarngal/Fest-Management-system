import express from "express";
import {
  addToCart,
  updateCartItem,
  deleteCartItem,
  getCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/delete", deleteCartItem);
router.get("/:uid", getCart);

export default router;
