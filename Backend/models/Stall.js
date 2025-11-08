import mongoose from "mongoose";

const TokenHistorySchema = new mongoose.Schema({
  tokenNumber: Number,
  visitorName: String,
  mobile: String,
  email: String,
  timestamp: { type: Date, default: Date.now },
});

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
});

const StallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  ownerName: String,
  ownerUID: String, // 🔥 Link to Firebase UID
  contact: String,
  location: String,
  qrCodeDataUrl: String,
  currentToken: { type: Number, default: 0 },
  tokens: [TokenHistorySchema],
  menu: [MenuItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Stall", StallSchema);
