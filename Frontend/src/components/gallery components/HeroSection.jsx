import React from "react";
import { motion } from "framer-motion";
import { Camera, Heart, Music4 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-black overflow-hidden text-white pt-7 pb-24">
      {/* 💫 Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[28rem] h-[28rem] bg-pink-600/20 blur-[180px] top-10 left-0 animate-pulse" />
        <div className="absolute w-[30rem] h-[30rem] bg-purple-700/25 blur-[200px] bottom-0 right-0 animate-pulse" />
      </div>

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-pink-400 font-semibold uppercase tracking-[6px] mb-3"
        >
          // Memories in Motion //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white "
        >
          Capture the Moments that Matter 
          <br />
          <span className="text-pink-500">
            Dive into Stories that Shine ✨
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          Dive into our vibrant gallery — every photo tells a story of{" "}
          <span className="text-pink-400 font-semibold">joy</span>,{" "}
          <span className="text-purple-400 font-semibold">music</span>, and{" "}
          <span className="text-white font-semibold">unforgettable memories</span>.  
          Relive the laughter, the lights, and the love — one frame at a time. 🎶
        </motion.p>

      </div>

      {/* ✨ Floating sparkles */}
      <div className="absolute top-12 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-16 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default HeroSection;
