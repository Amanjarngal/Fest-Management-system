// controllers/voteController.js
import Vote from "../models/Vote.js";
import Participant from "../models/Participant.js"
import AppConfig from "../models/AppConfig.js";


// 🗳️ CAST VOTE
export async function castVote(req, res) {
  try {
    const cfg = await AppConfig.findOne({ key: "voting" });
    if (!cfg?.value?.isLive)
      return res.status(403).json({ error: "Voting is not live" });

    const userId = req.user.uid;
    const { participantId } = req.params;

    if (!participantId)
      return res.status(400).json({ error: "participantId required" });

    const alreadyVoted = await Vote.findOne({ userId });
    if (alreadyVoted)
      return res.status(400).json({ error: "You have already voted once!" });

    const vote = new Vote({ userId, participantId });
    await vote.save();

    const updated = await Participant.findByIdAndUpdate(
      participantId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    const io = req.app.get("io");
    if (io) {
      io.emit("voteUpdate", { id: participantId, votes: updated.votes });
      const top = await Participant.find().sort({ votes: -1 }).limit(5);
      io.emit("leaderboardUpdate", top);

       // 🆕 Emit updated stats
  const totalParticipants = await Participant.countDocuments();
  const totalVotes = await Vote.countDocuments();
  io.emit("statsUpdate", { totalParticipants, totalVotes });
    }

    res.json({
      message: "Vote recorded successfully ✅",
      participant: updated,
    });
  } catch (err) {
    console.error("Voting Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already voted once!" });
    }
    res.status(500).json({ error: err.message });
  }
}

// 📊 GET VOTE COUNT FOR EACH PARTICIPANT
export async function getVotes(req, res) {
  try {
    const participants = await Participant.find()
      .select("name tagNumber photoUrl votes") // fix field name: photoUrl
      .sort({ votes: -1 });

    res.json({
      message: "Votes fetched successfully ✅",
      totalParticipants: participants.length,
      participants,
    });
  } catch (err) {
    console.error("Error fetching votes:", err);
    res.status(500).json({ error: err.message });
  }
}

// ✅ NEW: GET VOTED PARTICIPANTS OF CURRENT USER
export async function getUserVotes(req, res) {
  try {
    const userId = req.user.uid;
    const votes = await Vote.find({ userId }).select("participantId -_id");
    const votedIds = votes.map(v => v.participantId.toString());
    res.json({ voted: votedIds });
  } catch (err) {
    console.error("Error fetching user votes:", err);
    res.status(500).json({ error: "Failed to fetch user votes" });
  }
}

// 📊 Get total participants & votes
export async function getVotingStats(req, res) {
  try {
    const totalParticipants = await Participant.countDocuments();
    const totalVotes = await Vote.countDocuments();

    res.json({
      message: "Stats fetched successfully ✅",
      totalParticipants,
      totalVotes,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: err.message });
  }
}

