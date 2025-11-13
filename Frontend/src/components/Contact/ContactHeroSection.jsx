import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactHeroSection = () => {
  return (
    <section className="relative bg-black overflow-hidden text-white pt-7 pb-24">
      {/* 💫 Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[28rem] h-[28rem] bg-blue-600/20 blur-[180px] top-10 left-0 animate-pulse" />
        <div className="absolute w-[30rem] h-[30rem] bg-purple-700/25 blur-[200px] bottom-0 right-0 animate-pulse" />
      </div>

      {/* 🌟 Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-pink-500 font-semibold uppercase tracking-[6px] mb-3"
        >
          // Contact Us //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white"
        >
          We’re Here to{" "}
          <span className="text-pink-500">Help You</span>  
          <br />
          <span className="text-purple-400">Reach Out Anytime</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          Have questions, suggestions, or need support?  
          Our team is always ready to assist you.  
          Connect with us and we’ll get back to you at the earliest. ✨
        </motion.p>

        {/* ✨ Animated Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center gap-8 mt-10"
        >
          <div className="p-4 rounded-full bg-white/10 hover:bg-blue-500/30 transition-all">
            <Mail size={32} className="text-blue-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-purple-500/30 transition-all">
            <Phone size={32} className="text-purple-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-yellow-400/30 transition-all">
            <MapPin size={32} className="text-yellow-300" />
          </div>
        </motion.div>
      </div>

      {/* ✨ Floating sparkles */}
      <div className="absolute top-12 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-16 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default ContactHeroSection;
