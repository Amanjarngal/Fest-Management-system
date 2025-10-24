import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  isLeaderboardLive: { type: Boolean, default: false },
  leaderboardRevealTime: { type: Date, default: null },
  isVotingLive: { type: Boolean, default: false },
});

export default mongoose.model("Config", ConfigSchema);
