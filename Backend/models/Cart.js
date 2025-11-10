import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  pricingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pricing", // ✅ Reference to Pricing model
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    uid: {
      type: String, // ✅ Firebase UID
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // ✅ Reference to Event model
      required: true,
    },
    items: [cartItemSchema], // ✅ Nested subdocument schema
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
