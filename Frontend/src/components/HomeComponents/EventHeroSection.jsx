import React from "react";
import { MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EventHeroSection = () => {
    const navigatory=useNavigate();
  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          {/* Location and Date */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-5">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-400" />
              <span>Amritsar Group Of Colleges ,Main Ground</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-400" />
              <span>10 Am To 12 Pm 20 April 2025</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-5xl font-extrabold leading-snug mb-5">
            Grab Your Seat Now <br></br> Or You <br />
            <span className="text-pink-500">May Regret it Once</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-lg">
           College fests bring students together to celebrate creativity, culture, and connections. From music and dance to competitions and laughter, it’s all about living the best moments with your campus community.
          </p>

          {/* Buttons */}
<div className="flex flex-wrap items-center gap-5 mt-6">
  {/* 🎟️ Buy Ticket Button */}
  <motion.button
    whileHover={{
      scale: 1.05,
      boxShadow: "0 0 20px rgba(236,72,153,0.5)",
    }}
    onClick={() => navigatory("/eventSchedules")}
    className=" btn-gradient flex items-center justify-center gap-2 bg-gradient text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-pink-500/50 transition-all duration-300"
  >
    
    
    <span>Buy Your Ticket</span>
  </motion.button>

  {/* 📞 Contact Us Button */}
  <motion.button
    whileHover={{
      scale: 1.05,
      color: "#EC4899",
      borderColor: "#EC4899",
    }}
    onClick={() => navigatory("/contact")}
    className="flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:text-pink-400 hover:border-pink-500 transition-all duration-300"
  >
    <span>Contact Us</span>
    <span className="text-lg">→</span>
  </motion.button>
</div>

        </motion.div>

        {/* Right Section (Image) */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center"
        >
          <img
            src="https://images.stockcake.com/public/0/0/c/00ce5e40-a745-4743-9c29-8aa679f23e25_large/rock-concert-performance-stockcake.jpg"
            alt="Event Celebration"
            className="rounded-[1.5rem] shadow-lg border border-purple-600/20 object-cover w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default EventHeroSection;
