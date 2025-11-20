import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

const EventHero = () => {
  return (
    <section className="relative bg-black overflow-hidden text-white pt-6 pb-24">
      {/* 💫 Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-600/20 blur-[160px] top-0 left-0 animate-pulse" />
        <div className="absolute w-[30rem] h-[30rem] bg-purple-700/20 blur-[180px] bottom-0 right-0 animate-pulse" />
      </div>

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-pink-400 font-semibold uppercase tracking-[6px] mb-3"
        >
          // Event Schedule & Tickets //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white "
        >
          Experience the <br />
          <span className="text-pink-500">Festival of Excitement </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          Don’t miss the most awaited event of the year!  
          Join us for unforgettable performances, vibrant energy, and pure celebration.
        </motion.p>

        {/* 🗓️ Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="bg-gradient-to-br from-pink-600/10 via-purple-700/10 to-transparent border border-pink-500/30 rounded-2xl px-8 py-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CalendarDays className="mx-auto text-pink-400 w-7 h-7 mb-2" />
            <h3 className="text-lg font-semibold text-white">Dec 5–7, 2025</h3>
            <p className="text-sm text-gray-400">3 Days of Pure Fun</p>
          </div>

          <div className="bg-gradient-to-br from-purple-700/10 via-pink-600/10 to-transparent border border-purple-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <MapPin className="mx-auto text-purple-400 w-7 h-7 mb-2" />
            <h3 className="text-lg font-semibold text-white">Amritsar, India</h3>
            <p className="text-sm text-gray-400">Amritsar Group Of Colleges</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600/10 via-purple-700/10 to-transparent border border-pink-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <Ticket className="mx-auto text-pink-400 w-7 h-7 mb-2" />
            <h3 className="text-lg font-semibold text-white">Starting at ₹499</h3>
            <p className="text-sm text-gray-400">Early Bird Offer 🎫</p>
          </div>
        </motion.div>

       
      </div>

      {/* ✨ Floating Sparkles */}
      <div className="absolute top-10 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default EventHero;
