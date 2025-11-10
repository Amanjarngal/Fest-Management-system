import mongoose from "mongoose";

const stallCartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const stallCartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Firebase UID or User identifier
    stallId: { type: mongoose.Schema.Types.ObjectId, ref: "Stall", required: true },
    items: [stallCartItemSchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("StallCart", stallCartSchema);
 