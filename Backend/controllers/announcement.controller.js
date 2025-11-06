const Announcement = require("../models/Announcement");

/**
 * 📨 CREATE Announcement
 */
const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user?.uid || "Admin",
    });

    // ⚡ Emit real-time update to all connected clients
    const io = req.app.get("io");
    if (io) io.emit("newAnnouncement", announcement);

    res.status(201).json({ message: "Announcement created successfully", announcement });
  } catch (error) {
    console.error("Create Announcement Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * 📜 FETCH All Announcements
 */
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (error) {
    console.error("Fetch Announcements Error:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

/**
 * ✏️ EDIT Announcement
 */
const editAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;

    const updated = await Announcement.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Announcement not found" });

    res.json({ message: "Announcement updated successfully", updated });
  } catch (error) {
    console.error("Edit Announcement Error:", error);
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

/**
 * ❌ DELETE Announcement
 */
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Announcement not found" });

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete Announcement Error:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
};
