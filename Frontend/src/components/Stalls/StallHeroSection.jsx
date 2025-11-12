import React from "react";
import { motion } from "framer-motion";
import { Store, Utensils, Lightbulb } from "lucide-react";

const StallHeroSection = () => {
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
          // Festive Stalls //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white"
        >
          Explore the <span className="text-pink-500">Heart of the Fest </span>
          <br />
          <span className="text-purple-400">Taste • Create • Celebrate</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          Step into our lively stalls packed with{" "}
          <span className="text-pink-400 font-semibold">flavors</span>,{" "}
          <span className="text-purple-400 font-semibold">crafts</span>, and{" "}
          <span className="text-white font-semibold">vibrant creativity</span>.
          Whether you’re here to savor, shop, or simply smile — 
          every corner has something special waiting for you. ✨
        </motion.p>

        {/* ✨ Animated Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center gap-8 mt-10"
        >
          <div className="p-4 rounded-full bg-white/10 hover:bg-pink-500/30 transition-all">
            <Store size={32} className="text-pink-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-purple-500/30 transition-all">
            <Utensils size={32} className="text-purple-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-yellow-400/30 transition-all">
            <Lightbulb size={32} className="text-yellow-300" />
          </div>
        </motion.div>
      </div>

      {/* ✨ Floating sparkles */}
      <div className="absolute top-12 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-16 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default StallHeroSection;
