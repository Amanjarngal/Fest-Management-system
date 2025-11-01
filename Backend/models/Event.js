import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  day: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // Cloudinary URL
  ticketsAvailable: { type: Number, default: 0 },
  ticketsSold: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
