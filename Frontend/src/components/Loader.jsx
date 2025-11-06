import React from "react";
import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      {/* 🔮 Glowing Background */}
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-[150px] top-10 left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />

      {/* 🌀 Animated Spinner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="relative flex items-center justify-center mb-6"
      >
        <div className="w-20 h-20 border-4 border-transparent border-t-pink-500 border-l-purple-500 rounded-full animate-spin"></div>
      </motion.div>

      {/* ✨ Loader Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-white"
      >
        {text}
      </motion.h2>

      {/* 🌈 Subtext shimmer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.8,
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-gray-400 mt-2"
      >
        Please wait a moment ✨
      </motion.p>
    </section>
  );
};

export default Loader;
