import axios from "axios";
import Booking from "../models/Booking.js";
import Cart from "../models/Cart.js";
import Pricing from "../models/Pricing.js";
import Event from "../models/Event.js";

// PayPal base URL (sandbox for testing)
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

/* 🧾 Step 1️⃣: Create PayPal order */
export const createPayPalOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.pricingId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.pricingId.price,
      0
    );

    // 🔑 Get OAuth token from PayPal
    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const tokenRes = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 🧾 Create PayPal order
    const orderRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      orderID: orderRes.data.id,
      totalAmount,
    });
  } catch (err) {
    console.error("❌ PayPal order creation error:", err.response?.data || err);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

/* ✅ Step 2️⃣: Capture PayPal payment & save booking */
export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID, userId } = req.body;

    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    // Get access token
    const tokenRes = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Capture payment
    const captureRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = captureRes.data;

    // 🧾 Save booking to DB
    const cart = await Cart.findOne({ userId }).populate("items.pricingId eventId");
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.pricingId.price,
      0
    );

    const booking = new Booking({
      userId,
      eventId: cart.eventId,
      tickets: cart.items.map((i) => ({
        pricingId: i.pricingId._id,
        ticketType: i.pricingId.ticketType,
        quantity: i.quantity,
        price: i.pricingId.price,
      })),
      totalAmount,
      paymentStatus: "success",
      paymentId: payment.id,
    });

    await booking.save();

    // Decrease available tickets
    for (const item of cart.items) {
      await Pricing.findByIdAndUpdate(item.pricingId, {
        $inc: { totalTickets: -item.quantity },
      });
    }

    await Cart.deleteOne({ userId });

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ Error capturing PayPal payment:", err.response?.data || err);
    res.status(500).json({ error: "Payment capture failed" });
  }
};

/* 🧾 Get all bookings (Admin) */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId", "title date location")
      .populate("tickets.pricingId", "ticketType price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 👤 Get user bookings */
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate("eventId", "title date location")
      .populate("tickets.pricingId", "ticketType price")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
