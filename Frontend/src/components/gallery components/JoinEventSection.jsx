import { motion } from "framer-motion";
import { Ticket, Calendar, MapPin } from "lucide-react";

const JoinEventSection = () => {
  return (
    <section className="relative py-24 bg-[#0b0b12] text-white overflow-hidden">
      {/* Soft Glow Accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Get Your Ticket Now
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Don’t miss out on the most electrifying night of the year.  
          Secure your pass and be part of an unforgettable experience filled with music, lights, and magic.
        </p>

        {/* Ticket Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#141421] to-[#1d1d2f] rounded-3xl p-8 shadow-xl border border-white/10 max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Event Info */}
            <div className="text-left space-y-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">December 21, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Bangalore City Grounds</span>
              </div>

              <h3 className="text-2xl font-bold mt-3">
                Night of Lights Festival 2025
              </h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Join artists, creators, and dreamers under one sky. Let’s make memories that glow forever.
              </p>
            </div>

            {/* Ticket Price + Button */}
            <div className="bg-[#0b0b12] border border-white/10 rounded-2xl px-8 py-6 text-center shadow-inner">
              <p className="text-sm text-gray-400 mb-1">Starting From</p>
              <h4 className="text-3xl font-extrabold text-pink-400 mb-3">₹899</h4>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-pink-500/40 transition"
              >
                <Ticket className="w-5 h-5" />
                Buy Ticket
              </motion.button>

              <p className="text-xs text-gray-500 mt-3">Limited early-bird passes available</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default JoinEventSection;
