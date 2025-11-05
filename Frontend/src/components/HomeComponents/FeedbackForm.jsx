import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.feedback || rating === 0) {
      alert("⚠️ Please fill out all fields and select a rating.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Send feedback to backend
      await axios.post(`${BACKEND_URI}/api/feedback`, {
        name: formData.name,
        email: formData.email,
        feedback: formData.feedback,
        rating,
      });

      setSubmitted(true);
      setLoading(false);

      // Reset after delay
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", feedback: "" });
        setRating(0);
      }, 2500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("❌ Failed to send feedback. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-black text-white py-24 overflow-hidden">
      {/* 🌈 Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 bg-pink-600/20 blur-[160px] top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-600/20 blur-[180px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 px-6 relative z-10">
        <p className="text-pink-400 text-sm font-semibold tracking-widest mb-2">
          // Share Your Thoughts //
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          We Value Your <span className="text-pink-500">Feedback</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm md:text-base">
          Tell us how your fest experience was — your opinions help us make it even better next time!
        </p>
      </div>

      {/* Feedback Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-2xl mx-auto p-[2px] rounded-2xl shadow-[0_0_35px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] transition-all duration-500"
      >
        <div className="bg-gray-900/80 border border-gray-800 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-lg">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Rate Your Experience</label>
            <div className="flex gap-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={30}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`cursor-pointer transition-transform transform hover:scale-110 ${
                    i <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Your Feedback</label>
            <textarea
              rows="4"
              placeholder="Share your experience..."
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-lg font-semibold shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all ${
              submitted
                ? "bg-green-500 text-black"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-black"
            }`}
          >
            {loading
              ? "Submitting..."
              : submitted
              ? "✅ Feedback Sent!"
              : "Submit Feedback"}
          </motion.button>
        </div>
      </motion.form>
    </section>
  );
};

export default FeedbackForm;
