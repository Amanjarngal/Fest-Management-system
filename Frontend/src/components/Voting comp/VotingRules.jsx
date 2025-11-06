import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, UserCheck, Lock, Trophy } from "lucide-react";

const rules = [
  {
    icon: <UserCheck className="text-pink-400 w-7 h-7" />,
    title: "One User, One Vote",
    description:
      "Each registered user is allowed to cast only one vote throughout the competition. Multiple votes from the same account are not permitted.",
  },
  {
    icon: <Clock className="text-purple-400 w-7 h-7" />,
    title: "Limited Voting Period",
    description:
      "Voting will be active only during the official event window. Once the voting period ends, no further votes will be accepted.",
  },
  {
    icon: <Lock className="text-pink-400 w-7 h-7" />,
    title: "Votes Cannot Be Changed",
    description:
      "After a vote is cast, it cannot be modified or withdrawn. Please review your choice before submitting your vote.",
  },
  {
    icon: <ShieldCheck className="text-purple-400 w-7 h-7" />,
    title: "Fair Play",
    description:
      "The system automatically prevents duplicate or fraudulent votes. Any misuse may lead to disqualification of the participant.",
  },
  {
    icon: <Trophy className="text-pink-400 w-7 h-7" />,
    title: "Results Declaration",
    description:
      "Results will be announced publicly once the voting phase concludes and all votes have been verified by the admin panel.",
  },
  {
  icon: <ShieldCheck className="text-purple-400 w-7 h-7" />,
  title: "Vote Integrity & Security",
  description:
    "Your vote is completely secure and cannot be changed or deleted by anyone, including the admin. Once submitted, it is permanently stored and protected within our verified voting system.",
},

];


const VotingRules = () => {
  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
    {/* Glowing background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-600/20 blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.7 }}
  className="text-4xl sm:text-6xl md:text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
>
  Voting Rules & 
  <span className="text-pink-500">
     Guidelines ⚖️
  </span>
</motion.h1>


        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Please review the voting rules carefully before participating.
          Ensuring fairness and transparency helps maintain the spirit of this event.
        </motion.p>

        {/* Rules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                {rule.icon}
                <h3 className="text-xl font-semibold text-white">
                  {rule.title}
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VotingRules;
