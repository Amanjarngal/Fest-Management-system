import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const EventDetailsSection = () => {
  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">

     {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
        >
          Fest <span className="text-pink-400">Event Details</span>
        </motion.h2>

        {/* Card Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-pink-500/30 transition"
          >
            <CalendarDays className="text-pink-400 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Dates</h3>
            <p className="text-gray-300 text-lg">
              15th – 17th December 2025  
              <br />
              (3-Day Mega Celebration)
            </p>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-purple-500/30 transition"
          >
            <MapPin className="text-purple-400 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Location</h3>
            <p className="text-gray-300 text-lg">
              AGC College Ground,  
              <br />
              Amritsar, Punjab
            </p>
          </motion.div>

          {/* Timing Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-blue-500/30 transition"
          >
            <Clock className="text-blue-400 w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Timings</h3>
            <p className="text-gray-300 text-lg">
              Daily: 10:00 AM – 8:00 PM  
              <br />
              Performances start 6 PM onwards
            </p>
          </motion.div>

        </div>

        {/* Venue Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-16 p-10 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
        >
          <h3 className="text-3xl font-extrabold mb-4 text-pink-400">Venue Information</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            The fest will be hosted across multiple zones inside the campus including:  
            <br />• Main Stage Arena  
            <br />• Cultural Pavilion  
            <br />• Tech & Innovation Hall  
            <br />• Sports Grounds  
            <br />• Food & Fun Street  
            <br />
            Ample seating, security checkpoints, medical booths, and information kiosks will be available throughout the campus.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetailsSection;
