  import Booking from "../models/Booking.js";
  import Cart from "../models/Cart.js";
  import Pricing from "../models/Pricing.js";
  import Event from "../models/Event.js";
  import { razorpayInstance } from "../utils/razorpay.js";
  import crypto from "crypto";

  // 🧾 Step 1: Create order for payment
  export const createBookingOrder = async (req, res) => {
    try {
      const { userId } = req.body;

      const cart = await Cart.findOne({ userId }).populate("items.pricingId");
      if (!cart || cart.items.length === 0)
        return res.status(400).json({ error: "Cart is empty" });

      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.pricingId.price,
        0
      );

      const options = {
        amount: totalAmount * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };

      const order = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: totalAmount,
        currency: "INR",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // ✅ Step 2: Verify and save booking after payment
  export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature)
        return res.status(400).json({ error: "Invalid signature" });

      const cart = await Cart.findOne({ userId }).populate("items.pricingId eventId");
      if (!cart) return res.status(400).json({ error: "Cart not found" });

      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.pricingId.price,
        0
      );

      const booking = new Booking({
        userId,
        eventId: cart.eventId,
        tickets: cart.items.map(i => ({
          pricingId: i.pricingId._id,
          ticketType: i.pricingId.ticketType,
          quantity: i.quantity,
          price: i.pricingId.price
        })),
        totalAmount,
        paymentStatus: "success",
        paymentId: razorpay_payment_id,
      });

      await booking.save();

      // Decrease available tickets (atomic)
      for (const item of cart.items) {
        await Pricing.findByIdAndUpdate(item.pricingId, {
          $inc: { totalTickets: -item.quantity }
        });
      }

      await Cart.deleteOne({ userId }); // empty the cart

      res.status(201).json({ success: true, message: "Booking confirmed", booking });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // 🧾 Get all bookings (Admin only)
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

  // 👤 Get user’s own bookings
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
