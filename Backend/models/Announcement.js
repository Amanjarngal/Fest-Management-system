import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    createdBy: {
      type: String, // optional: admin UID or email
      default: "Admin",
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("Announcement", announcementSchema);
