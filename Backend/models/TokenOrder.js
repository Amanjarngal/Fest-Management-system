import mongoose from "mongoose";

const TokenorderSchema = new mongoose.Schema({
  stallId: { type: mongoose.Schema.Types.ObjectId, ref: "Stall" },
  items: [
    {
      itemId: String,
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  totalAmount: Number,
  paymentMode: { type: String, enum: ["counter", "online"], required: true },
  upiId: String,
  transactionNumber: String,
  paymentTime: String,
  uploadTime: String,
  paymentScreenshot: String, // Cloudinary URL
  status: { type: String, default: "pending" },
  tokenNumber: Number,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TokenOrder", TokenorderSchema);
