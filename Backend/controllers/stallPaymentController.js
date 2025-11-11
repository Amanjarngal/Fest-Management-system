import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import StallOrder from "../models/StallOrder.js";
import StallCart from "../models/StallCart.js";
import Stall from "../models/Stall.js"; // ✅ Needed to fetch item names

dotenv.config();

/**
 * 🛒 Create Stall Razorpay Order
 */
export const createStallOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid or missing total amount" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: `stall_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ order });
  } catch (err) {
    console.error("❌ Stall createOrder error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🧾 Verify Stall Payment & Save Order (with item names)
 */
export const verifyStallPayment = async (req, res) => {
  try {
    const {
      uid,
      stallId,
      items,
      totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ✅ Validate input
    if (!stallId || !items?.length) {
      return res.status(400).json({ error: "Missing stallId or items" });
    }

    // ✅ Verify Razorpay Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Fetch stall and find item names
    const stall = await Stall.findById(stallId);
    if (!stall) return res.status(404).json({ error: "Stall not found" });

    const enrichedItems = items.map((it) => {
      const found = stall.items.find(
        (s) => s._id.toString() === it.itemId.toString()
      );
      return {
        itemId: it.itemId,
        name: found?.name || "Unknown Item",
        price: it.price,
        quantity: it.quantity,
        imageUrl: found?.imageUrl || "",
      };
    });

    // ✅ Generate unique token
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);

    // ✅ Save Stall Order
    const order = await StallOrder.create({
      uid,
      stallId,
      items: enrichedItems, // includes item names
      totalAmount,
      tokenNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentStatus: "SUCCESS",
    });

    // ✅ Clear Cart
    await StallCart.findOneAndUpdate(
      { userId: uid },
      { $set: { items: [], totalPrice: 0 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and order saved successfully",
      tokenNumber,
      order,
    });
  } catch (err) {
    console.error("❌ Verify stall payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📊 Get Stall Orders by Stall ID (includes item names)
 */
export const getStallOrders = async (req, res) => {
  try {
    const { stallId } = req.params;
    if (!stallId) return res.status(400).json({ error: "stallId is required" });

    const orders = await StallOrder.find({ stallId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this stall.",
        totalSales: 0,
        orderCount: 0,
        orders: [],
      });
    }

    const totalSales = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      stallId,
      orderCount: orders.length,
      totalSales,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching stall orders:", err);
    res.status(500).json({ error: err.message });
  }
};
