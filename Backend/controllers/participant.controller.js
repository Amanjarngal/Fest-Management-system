import   Participant  from "../models/Participant.js";
import  { uploadBuffer } from "../utils/cloudinaryUpload.js";
import multer from "multer";
const upload = multer(); // memory storage by default

// create participant (admin)
// Expect multipart/form-data: fields name, tagNumber, details and file "photo"
export const createParticipant = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, tagNumber, details } = req.body;
      if (!name || !tagNumber) return res.status(400).json({ error: "name & tagNumber required" });

      let photoUrl = null;
      if (req.file) {
        const result = await uploadBuffer(req.file.buffer, "participants");
        photoUrl = result.secure_url;
      }

      const participant = new Participant({ name, tagNumber, details, photoUrl });
      await participant.save();
      res.json({ participant });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
];

export const editParticipant = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (req.file) {
        const result = await uploadBuffer(req.file.buffer, "participants");
        updates.photoUrl = result.secure_url;
      }
      const p = await Participant.findByIdAndUpdate(id, updates, { new: true });
      res.json({ participant: p });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
];

export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    await Participant.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listParticipants = async (req, res) => {
  try {
    const participants = await Participant.find().sort({ votes: -1, name: 1 });
    res.json({ participants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


