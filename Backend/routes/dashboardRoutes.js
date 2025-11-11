import express from "express";
import User from "../models/User.js";
import Participant from "../models/Participant.js";
import Vote from "../models/Vote.js";
import EventOrder from "../models/EventOrder.js";
import StallOrder from "../models/StallOrder.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    // ✅ Basic counts
    const totalUsers = await User.countDocuments();
    const totalParticipants = await Participant.countDocuments();
    const totalVotes = await Vote.countDocuments();

    // ✅ Event & Stall Orders
    const eventOrders = await EventOrder.find();
    const stallOrders = await StallOrder.find();

    // ✅ Earnings Calculation (successful payments only)
    const eventEarnings = eventOrders
      .filter((o) => o.paymentStatus === "SUCCESS")
      .reduce((sum, o) => sum + (o.amount || o.totalAmount || 0), 0);

    const stallEarnings = stallOrders
      .filter((o) => o.paymentStatus === "SUCCESS")
      .reduce(
        (sum, o) => sum + (o.amount || o.totalPrice || o.totalAmount || 0),
        0
      );

    // ✅ Votes per Participant
    const participants = await Participant.find({}, "name");
    const votes = await Vote.find({}, "participantId");

    // Create a map of participant votes
    const voteCountMap = {};
    votes.forEach((v) => {
      const pid = v.participantId?.toString();
      if (pid) {
        voteCountMap[pid] = (voteCountMap[pid] || 0) + 1;
      }
    });

    // Merge participant names + vote counts
    const participantVotes = participants.map((p) => ({
      name: p.name,
      votes: voteCountMap[p._id.toString()] || 0,
    }));

    // Sort by votes descending
    participantVotes.sort((a, b) => b.votes - a.votes);

    // ✅ Respond with everything
    res.json({
      totalUsers,
      totalParticipants,
      totalVotes,
      eventOrders: eventOrders.length,
      stallOrders: stallOrders.length,
      eventEarnings,
      stallEarnings,
      participantVotes, // 🟢 Added this line
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

export default router;
