import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import EventOrder from "../models/EventOrder.js";
import Cart from "../models/Cart.js"; // ✅ Add this at the top
import Event from "../models/Event.js";


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
  order: {
    _id: order._id,
    ticketOrderId: order.ticketOrderId,
    amount: order.amount,
    items: order.items,
  }
});

  } catch (err) {
    console.error("❌ Verify event payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
};




  /**
 * 📊 Get Event Orders by Event ID
 * Shows total tickets sold and total revenue
 */
export const getEventOrders = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" });
    }

    // ✅ Fetch all orders for the given event
    const orders = await EventOrder.find({ "items.eventId": eventId }).sort({
      createdAt: -1,
    });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this event.",
        totalTickets: 0,
        totalRevenue: 0,
        orders: [],
      });
    }

    // ✅ Calculate totals
    const totalTickets = orders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
      0
    );

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    res.status(200).json({
      success: true,
      eventId,
      totalTickets,
      totalRevenue,
      orderCount: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching event orders:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📊 Get All Event Orders (not per event)
 * Returns detailed info about every order
 */
export const getAllEventOrders = async (req, res) => {
  try {
    const orders = await EventOrder.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "items.eventId",
        model: Event,
        select: "title price day date location",
      })
      .populate({
        path: "items.pricingId",
        select: "ticketType finalPrice price",
      })
      .lean();

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No event orders found.",
        totalTickets: 0,
        totalRevenue: 0,
        totalOrders: 0,
        orders: [],
      });
    }

    const totalTickets = orders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce((acc, item) => acc + (item.quantity || 1), 0),
      0
    );

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const detailedOrders = orders.map((order) => ({
      orderId: order._id,
      ticketOrderId: order.ticketOrderId,
      userId: order.uid,
      amount: order.amount,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,

      items: order.items.map((i) => ({
        eventId: i.eventId?._id,
        title: i.eventId?.title || "Unknown Event",
        date: i.eventId?.date || "N/A",
        location: i.eventId?.location || "N/A",

        // ⭐ ADDING TICKET TYPE
        ticketName: i.pricingId?.ticketType || "General",

        quantity: i.quantity,

        // ⭐ Use final price if available
        price: i.pricingId?.finalPrice || i.pricingId?.price || i.price || 0,

        subtotal:
          (i.pricingId?.finalPrice || i.pricingId?.price || i.price || 0) *
          (i.quantity || 1),
      })),
    }));

    res.status(200).json({
      success: true,
      message: "All event orders fetched successfully",
      totalOrders: orders.length,
      totalTickets,
      totalRevenue,
      orders: detailedOrders,
    });
  } catch (err) {
    console.error("❌ Error fetching all event orders:", err);
    res.status(500).json({ error: err.message });
  }
};




export const getUserOrders = async (req, res) => {
  try {
    const { uid } = req.params;

    const orders = await EventOrder.find({ uid })
      .sort({ createdAt: -1 })
      .populate("items.eventId", "title date location")
      .populate("items.pricingId", "ticketType finalPrice price");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
