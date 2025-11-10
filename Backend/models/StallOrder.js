import mongoose from "mongoose";

const stallOrderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    stallId: { type: mongoose.Schema.Types.ObjectId, ref: "Stall", required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    paymentStatus: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  },
  { timestamps: true }
);

export default mongoose.model("StallOrder", stallOrderSchema);
