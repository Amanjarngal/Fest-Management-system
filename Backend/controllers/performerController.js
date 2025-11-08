import  Performer  from "../models/Performer.js";
import  Event  from "../models/Event.js"; // Make sure you have Event model

/**
 * @desc Add a new performer
 * @route POST /api/performers
 */
export const addPerformer = async (req, res) => {
  try {
    const { name, eventId, role, day } = req.body;
    const image = req.file?.path; // Cloudinary image URL

    if (!name || !eventId || !image || !day) {
      return res.status(400).json({ message: "All required fields missing!" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const performer = new Performer({
      name,
      eventId,
      role,
      image,
      day,
    });

    await performer.save();
    res.status(201).json({ success: true, performer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update performer (with optional new image)
 * @route PUT /api/performers/:id
 */
export const updatePerformer = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file?.path) {
      updateData.image = req.file.path; // new Cloudinary URL
    }

    const updated = await Performer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Performer not found" });
    res.status(200).json({ success: true, performer: updated });
  } catch (error) {
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
      .populate("eventId", "title date") // populate event info
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
    const performers = await Performer.find({ eventId: req.params.eventId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, performers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get single performer by ID
 * @route GET /api/performers/:id
 */
export const getPerformerById = async (req, res) => {
  try {
    const performer = await Performer.findById(req.params.id).populate(
      "eventId",
      "title date"
    );
    if (!performer) return res.status(404).json({ message: "Not found" });
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
