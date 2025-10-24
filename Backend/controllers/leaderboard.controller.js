import Participant from "../models/Participant.js";
import Config from "../models/Config.js";

// 🧑‍💻 Admin: Toggle leaderboard live status manually
export const toggleLeaderboard = async (req, res) => {
  try {
    const { isLive } = req.body;

    let config = await Config.findOne();
    if (!config) config = new Config();

    config.isLeaderboardLive = isLive;
    await config.save();

    res.json({
      success: true,
      message: `Leaderboard ${isLive ? "Activated ✅" : "Deactivated ❌"}`,
      config,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 📊 Public: Get leaderboard (shows top 3 + all participants)
export const getLeaderboard = async (req, res) => {
  try {
    const config = await Config.findOne();

    if (!config || !config.isLeaderboardLive) {
      return res.status(403).json({ message: "Leaderboard not live yet ⏳" });
    }

    // Top 3 participants
    const top3 = await Participant.find()
      .sort({ votes: -1 })
      .limit(3)
      .select("name photoUrl votes");

    // All participants sorted by votes
    const allParticipants = await Participant.find()
      .sort({ votes: -1 })
      .select("name photoUrl votes");

    res.json({ top3, allParticipants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🕓 Admin: Schedule leaderboard reveal time
export const scheduleLeaderboard = async (req, res) => {
  try {
    const { revealTime } = req.body;
    if (!revealTime) return res.status(400).json({ error: "revealTime required" });

    let config = await Config.findOne();
    if (!config) config = new Config();

    config.leaderboardRevealTime = new Date(revealTime);
    await config.save();

    res.json({ message: "Leaderboard reveal scheduled", config });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 📝 Optional: Get current config/status for admin dashboard
export const getLeaderboardStatus = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) config = { isLeaderboardLive: false, leaderboardRevealTime: null };
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
