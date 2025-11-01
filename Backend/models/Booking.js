import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  tickets: [
    {
      pricingId: { type: mongoose.Schema.Types.ObjectId, ref: "Pricing" },
      ticketType: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  paymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
