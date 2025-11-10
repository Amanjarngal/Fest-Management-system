import express from "express";
import { createEventOrder, verifyEventPayment } from "../controllers/eventPaymentController.js";

const router = express.Router();

router.post("/create-order", createEventOrder);
router.post("/verify-payment", verifyEventPayment);

export default router;
