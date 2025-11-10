import Razorpay from "razorpay";
import crypto from "crypto";
import StallOrder from "../models/StallOrder.js";

export const createStallOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay takes paise
      currency: "INR",
      receipt: `stall_${Date.now()}`,
    });

    res.status(200).json({ order });
  } catch (err) {
    console.error("❌ Stall createOrder error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const verifyStallPayment = async (req, res) => {
  try {
    const {
      stallId,
      items,
      totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const uid = req.user?.uid; // ✅ Verified Firebase UID

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    // ✅ Generate random token number
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);

    // 🧾 Save order in DB
    const order = await StallOrder.create({
      uid,
      stallId,
      items,
      totalAmount,
      tokenNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified & stall order saved",
      order,
      tokenNumber,
    });
  } catch (err) {
    console.error("❌ Verify stall payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
