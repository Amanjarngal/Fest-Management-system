import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, ImagePlus, Send } from "lucide-react";
import toast from "react-hot-toast";

const ShareMoment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    story: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Your moment has been shared successfully! 🎉");
    setFormData({ name: "", email: "", story: "", image: null });
  };

  return (
    <section className="relative bg-black text-white overflow-hidden pb-12">
      {/* ✨ Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 bg-pink-600/20 blur-[150px] top-10 left-0 animate-pulse" />
        <div className="absolute w-[30rem] h-[30rem] bg-purple-700/20 blur-[180px] bottom-0 right-0 animate-pulse" />
      </div>

      {/* 📝 Section Header */}
      <div className="relative z-10 text-center mb-12 px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-pink-400 font-semibold uppercase tracking-[6px] mb-3"
        >
          // Let’s Make It Fun //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-white"
        >
          Share Your Funniest Moment 
          <br />
          <span className="text-pink-500">Let’s Laugh Together!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          Every event has that one hilarious or unforgettable moment —  
          maybe you tripped on stage, photobombed a picture, or made the crowd laugh uncontrollably.  
          Tell us your story and make the whole team smile! 💫
        </motion.p>
      </div>

      {/* 🎉 Form Container */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        onSubmit={handleSubmit}
        className="relative z-10 max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-pink-400/20 rounded-3xl p-8 sm:p-12 shadow-lg text-center"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="flex-1 bg-gray-900/60 border border-pink-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 bg-gray-900/60 border border-pink-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
            />
          </div>

          <textarea
            name="story"
            rows="4"
            placeholder="Share your funniest or most memorable event moment..."
            value={formData.story}
            onChange={handleChange}
            required
            className="w-full bg-gray-900/60 border border-pink-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
          />

          {/* 📸 Image Upload */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label
              htmlFor="image"
              className="flex items-center gap-2 cursor-pointer text-pink-400 font-medium hover:text-pink-300 transition-all"
            >
              <ImagePlus className="w-5 h-5" />
              Upload a Photo (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.image && (
              <p className="text-sm text-gray-400 truncate">
                Selected: {formData.image.name}
              </p>
            )}
          </div>

          {/* 🚀 Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
          >
            <Send className="w-5 h-5" />
            Share My Moment
          </motion.button>
        </div>
      </motion.form>

      {/* ✨ Floating Sparkles */}
      <div className="absolute top-12 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default ShareMoment;
