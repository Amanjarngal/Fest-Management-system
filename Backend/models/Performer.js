import mongoose from "mongoose";

const performerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    role: {
      type: String,
      default: "Performer",
    },
    image: {
      type: String, // Cloudinary image URL
      
    },
    day: {
      type: String, // e.g. "Day 1"
        required: true,
    },
  },
  { timestamps: true }
);

export const Performer = mongoose.model("Performer", performerSchema);
