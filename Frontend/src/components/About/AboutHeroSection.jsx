import { motion } from "framer-motion";
import { Sparkles, Users, PartyPopper } from "lucide-react";

const AboutHeroSection = () => {
  return (
    <section className="relative bg-black overflow-hidden text-white pt-20 pb-32">

      {/* Background glows */}
      <div className="absolute inset-0">
        <div className="absolute w-[30rem] h-[30rem] bg-pink-600/20 blur-[180px] -top-10 left-0"></div>
        <div className="absolute w-[32rem] h-[32rem] bg-purple-600/25 blur-[200px] bottom-0 right-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-pink-400 tracking-[6px] font-semibold uppercase"
        >
          // About The Fest //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mt-3 leading-tight"
        >
          Celebrating <span className="text-pink-400">Talent</span>,  
          <span className="text-purple-400"> Creativity</span>,  
          & <span className="text-white">Unity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          Our annual fest brings together students from across the country  
          to showcase their passion, explore creativity, and create memories  
          that last a lifetime.
        </motion.p>

        {/* Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center gap-10 mt-12"
        >
          <div className="p-4 rounded-full bg-white/10 hover:bg-pink-500/20 transition">
            <Sparkles size={34} className="text-pink-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-purple-500/20 transition">
            <Users size={34} className="text-purple-400" />
          </div>
          <div className="p-4 rounded-full bg-white/10 hover:bg-yellow-500/20 transition">
            <PartyPopper size={34} className="text-yellow-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
