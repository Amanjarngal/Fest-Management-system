import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import EventOrder from "../models/EventOrder.js";
import Cart from "../models/Cart.js"; // ✅ Add this at the top


dotenv.config();

export const createEventOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // 🧾 Debug logging
    console.log("🪙 Creating Razorpay Event Order");
    console.log("Amount received:", amount);
    console.log("Key ID loaded:", !!process.env.RAZORPAY_KEY_ID);
    console.log("Key Secret loaded:", !!process.env.RAZORPAY_KEY_SECRET);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    // ✅ Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Create Razorpay order
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `event_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order Created:", order.id);

    res.status(200).json({ order });
  } catch (err) {
    console.error("❌ Event createOrder error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const verifyEventPayment = async (req, res) => {
  try {
    const {
      uid,
      items,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    // ✅ Save event order
    const order = await EventOrder.create({
      uid,
      items,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "SUCCESS",
    });

    // 🧹 ✅ Empty the user’s cart after payment success
    await Cart.findOneAndUpdate(
      { userId: order.uid },
      { $set: { items: [], totalPrice: 0 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified, order saved, and cart cleared",
      order,
    });
  } catch (err) {
    console.error("❌ Verify event payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
};



