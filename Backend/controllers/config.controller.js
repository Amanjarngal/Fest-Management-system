import AppConfig from "../models/AppConfig.js";

// ✅ Set (toggle) voting live status
export async function setVotingLive(req, res) {
  try {
    const { isLive } = req.body;

    if (typeof isLive !== "boolean") {
      return res.status(400).json({ error: "isLive must be true or false" });
    }

    const cfg = await AppConfig.findOneAndUpdate(
      { key: "voting" },
      { value: { isLive } },
      { upsert: true, new: true }
    );

    // ✅ Emit socket event to all connected clients
    const io = req.app.get("io");
    if (io) io.emit("votingStatus", { isLive });

    res.json({
      message: `Voting is now ${isLive ? "LIVE ✅" : "STOPPED ⛔"}`,
      config: cfg,
    });
  } catch (err) {
    console.error("Error setting voting status:", err);
    res.status(500).json({ error: "Failed to update voting status" });
  }
}

// ✅ Get current status
export async function getVotingStatus(req, res) {
  try {
    const cfg = await AppConfig.findOne({ key: "voting" });
    const isLive = cfg?.value?.isLive || false;
    res.json({ isLive });
  } catch (err) {
    console.error("Error fetching voting status:", err);
    res.status(500).json({ error: "Failed to fetch voting status" });
  }
}

// module.exports = { setVotingLive, getVotingStatus };
