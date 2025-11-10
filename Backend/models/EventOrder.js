import mongoose from "mongoose";

const eventOrderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    items: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        pricingId: { type: mongoose.Schema.Types.ObjectId, ref: "Pricing" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    amount: { type: Number, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    paymentStatus: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  },
  { timestamps: true }
);

export default mongoose.model("EventOrder", eventOrderSchema);
