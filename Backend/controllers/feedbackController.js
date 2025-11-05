import { Feedback } from "../models/Feedback.js";

/**
 * @desc Add new feedback
 * @route POST /api/feedback
 */
export const addFeedback = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    if (!name || !email || !rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = new Feedback({ name, email, rating, feedback });
    await newFeedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all feedbacks (Admin)
 * @route GET /api/feedback
 */
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
