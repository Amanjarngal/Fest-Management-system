const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagNumber: { type: String, required: true, unique: true },
  details: { type: String },
  photoUrl: { type: String },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Participant", ParticipantSchema);
