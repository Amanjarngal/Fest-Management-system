import Performer from "../models/Performer.js";
import Event from "../models/Event.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js"; // ✅ Make sure this exists

/**
 * @desc Add a new performer
 * @route POST /api/performers
 */
export const addPerformer = async (req, res) => {
  try {
    const { name, eventId, role, day } = req.body;

    if (!name || !eventId || !day) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let imageUrl = null;

    if (req.file) {
      const upload = await uploadBuffer(req.file.buffer, "performers");
      imageUrl = upload.secure_url;
    }

    const performer = await Performer.create({
      name,
      eventId,
      role,
      day,
      image: imageUrl,
    });

    res.status(201).json({ success: true, performer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc Update performer
 * @route PUT /api/performers/:id
 */
export const updatePerformer = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If new image is uploaded
    if (req.file) {
      const upload = await uploadBuffer(req.file.buffer, "performers");
      updateData.image = upload.secure_url;
    }

    const updated = await Performer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Performer not found" });

    res.status(200).json({ success: true, performer: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all performers
 * @route GET /api/performers
 */
export const getAllPerformers = async (req, res) => {
  try {
    const performers = await Performer.find()
      .populate("eventId", "title date")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, performers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get performers by Event ID
 * @route GET /api/performers/event/:eventId
 */
export const getPerformersByEvent = async (req, res) => {
  try {
    const performers = await Performer.find({ eventId: req.params.eventId });
    res.status(200).json({ success: true, performers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get single performer
 * @route GET /api/performers/:id
 */
export const getPerformerById = async (req, res) => {
  try {
    const performer = await Performer.findById(req.params.id).populate(
      "eventId",
      "title date"
    );

    if (!performer)
      return res.status(404).json({ message: "Performer not found" });

    res.status(200).json({ success: true, performer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete performer
 * @route DELETE /api/performers/:id
 */
export const deletePerformer = async (req, res) => {
  try {
    const performer = await Performer.findByIdAndDelete(req.params.id);

    if (!performer)
      return res.status(404).json({ message: "Performer not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
