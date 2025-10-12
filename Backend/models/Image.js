import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
    imageUrl: { type: String, required: true },
    public_id: { type: String }, // optional Cloudinary ID
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
