import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="relative h-[90vh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://boardmasters.com/wp-content/uploads/2025/08/BoardmastersFestival2025_07-08-2025_MattEachusTheMancPhotographer_001_MP1_8979-1200x800.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 px-6 text-white max-w-3xl">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Capture the <span className="text-yellow-400">Moments</span> that Matter
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8 text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Dive into our vibrant gallery — every photo tells a story of joy, music, and unforgettable memories.
        </motion.p>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        >
          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-500 transition duration-300">
            Explore Gallery
          </button>
        </motion.div> */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <ArrowDown size={28} />
        <p className="text-xs mt-1">Scroll Down</p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
