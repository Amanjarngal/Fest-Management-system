import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true, unique: true, }, // firebase uid
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
  createdAt: { type: Date, default: Date.now }
});

// ensure a user can vote only once across all participants (if that is desired) or once per participant.
// If you want one vote total: create unique compound index on userId
// For one vote per contest overall:
VoteSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("Vote", VoteSchema);
