import mongoose from "mongoose";

const stallOrderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },

    userName: { type: String },

    stallId: { type: mongoose.Schema.Types.ObjectId, ref: "Stall", required: true },

    items: [
     {
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },     // ✅ STORE NAME HERE
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],

    totalAmount: { type: Number, required: true },

    tokenNumber: { type: Number, required: true, unique: true },

    orderStatus: {
  type: String,
  enum: ["PENDING", "COMPLETED"],
  default: "PENDING",
},

    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },

    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StallOrder", stallOrderSchema);
