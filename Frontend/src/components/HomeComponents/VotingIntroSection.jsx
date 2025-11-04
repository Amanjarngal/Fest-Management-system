import React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Vote, Users, Clock, Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <Users size={26} />,
    title: "View Participants",
    desc: "Check out all the amazing participants performing live across different categories.",
  },
  {
    icon: <ThumbsUp size={26} />,
    title: "Choose Your Favorite",
    desc: "Decide who impressed you the most — your vote can make them the winner!",
  },
  {
    icon: <Vote size={26} />,
    title: "Vote Instantly",
    desc: "Click the vote button to support your favorite participant in real-time.",
  },
  {
    icon: <Clock size={26} />,
    title: "Watch Live Results",
    desc: "See the votes update live and feel the excitement build on stage.",
  },
  {
    icon: <Trophy size={26} />,
    title: "Celebrate Winners",
    desc: "Be part of the moment as your favorite performer takes the crown!",
  },
];

const VotingIntroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16 relative overflow-hidden">
      {/* Background Gradient Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
                <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
                <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
              </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <p className="text-sm uppercase tracking-widest text-gray-400">// Live Event Feature</p>
        <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
          Real-Time{" "}
          <span className="text-pink-500 italic">Voting System</span>
        </h2>
        <p className="text-gray-300 mt-4 text-base max-w-2xl mx-auto">
          Experience the thrill of audience participation! Vote for your favorite performers 
          and watch the results unfold live during the college fest.
        </p>
      </motion.div>

      {/* Steps / Info Boxes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#100A25] hover:bg-[#1a0e3a] transition-all duration-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-pink-500/20"
          >
            <div className="flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 w-14 h-14 rounded-full mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-12 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(236,72,153,0.4)" }}
          onClick={() => navigate("/voting")}
          className="btn-gradient text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/40 transition-all duration-300 flex gap-3"
        >
         <ArrowRight size={20} /> Voting Zone
         
        </motion.button>
      </div>
    </section>
  );
};

export default VotingIntroSection;
