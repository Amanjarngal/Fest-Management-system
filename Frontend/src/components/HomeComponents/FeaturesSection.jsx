import React from "react";
import {
  Mic,
  Lightbulb,
  Network,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Mic size={28} />,
    title: "Inspiring Speakers",
    description:
      "Listen to influential speakers, artists, and performers who share their journeys, insights, and motivation to ignite your creative spark.",
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Unforgettable Experience",
    description:
      "Immerse yourself in a vibrant atmosphere filled with energy, music, innovation, and excitement — creating memories that last forever.",
  },
  {
    icon: <Network size={28} />,
    title: "Networking & Collaboration",
    description:
      "Connect with students, creators, and professionals from across colleges — build friendships, exchange ideas, and grow together.",
  },
  {
    icon: <Calendar size={28} />,
    title: "Well-Planned Schedule",
    description:
      "Enjoy a perfectly organized lineup of events, performances, and competitions designed to keep you engaged every moment of the fest.",
  },
  {
    icon: <Users size={28} />,
    title: "Vibrant Community",
    description:
      "Be a part of an enthusiastic crowd that celebrates diversity, talent, and passion — where everyone belongs and contributes.",
  },
  {
    icon: <GraduationCap size={28} />,
    title: "Participation Certificates",
    description:
      "Get recognized for your involvement! All participants and volunteers receive official certificates as a token of appreciation.",
  },
];


// Animation directions alternating pattern
const animations = [
  { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }, // Left
  { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },  // Bottom
  { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },  // Right
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16 relative overflow-hidden">
      {/* Glowing background light effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      
     {/* Section Heading */}
<motion.div
  initial={{ opacity: 0, y: -40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="text-center mb-16 relative z-10"
>
  <p className="text-sm uppercase tracking-widest text-gray-400">// Features</p>
  <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
    Why Should You Join{" "}
    <span className="text-pink-500 italic">Our Event</span>
  </h2>
</motion.div>


      {/* Features Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 max-w-6xl mx-auto relative z-10">
        {features.map((feature, index) => {
          const anim = animations[index % animations.length];
          return (
            <motion.div
              key={index}
              className="flex items-start space-x-4 bg-[#0d0d0d] p-6 rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              variants={anim}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.2 }}
                className="flex-shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-4 text-white shadow-lg"
              >
                {feature.icon}
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
