import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";

// 📌 Add Event with image upload
export const addEvent = async (req, res) => {
  try {
    const { title, day, date, location, time, description } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });
      imageUrl = result.secure_url;
    }

    const newEvent = new Event({ title, day, date, location, time, description, imageUrl });
    await newEvent.save();

    res.status(201).json({ message: "✅ Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "🗑️ Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Edit / Update Event
export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, day, date, location, time, description, ticketsAvailable, ticketsSold } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) return res.status(404).json({ message: "Event not found" });

    // ✅ If image is updated, upload new one
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "events" });
      existingEvent.imageUrl = result.secure_url;
    }

    // ✅ Update basic fields
    existingEvent.title = title ?? existingEvent.title;
    existingEvent.day = day ?? existingEvent.day;
    existingEvent.date = date ?? existingEvent.date;
    existingEvent.location = location ?? existingEvent.location;
    existingEvent.time = time ?? existingEvent.time;
    existingEvent.description = description ?? existingEvent.description;
    existingEvent.ticketsAvailable = ticketsAvailable ?? existingEvent.ticketsAvailable;
    existingEvent.ticketsSold = ticketsSold ?? existingEvent.ticketsSold;

    await existingEvent.save();

    res.status(200).json({ message: "✅ Event updated successfully", event: existingEvent });
  } catch (error) {
    console.error("❌ Edit Event Error:", error);
    res.status(500).json({ error: error.message });
  }
};