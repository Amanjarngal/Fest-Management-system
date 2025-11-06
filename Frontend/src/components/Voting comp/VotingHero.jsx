import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const VotingHero = () => {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    // 🧭 1. Fetch initial stats from backend
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/api/votes/`);
        const data = await res.json();
        if (res.ok) {
          setStats({
            totalParticipants: data.totalParticipants || 0,
            totalVotes: data.totalVotes || 0,
          });
        } else {
          console.error("Error fetching stats:", data.error);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();

    // ⚡ 2. Connect to Socket.io for live updates
    const socket = io(BACKEND_URI, { transports: ["websocket"] });

    socket.on("statsUpdate", (data) => {
      setStats({
        totalParticipants: data.totalParticipants,
        totalVotes: data.totalVotes,
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <section className="relative bg-black overflow-hidden pt-10 pb-24 text-white">
      {/* 🔮 Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-700/30 blur-[180px] top-0 left-0 animate-pulse" />
        <div className="absolute w-96 h-96 bg-pink-600/30 blur-[180px] bottom-0 right-0 animate-pulse" />
      </div>

      {/* 🌟 Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-pink-400 font-semibold uppercase tracking-[6px] mb-3"
        >
          // Vote & Celebrate //
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-white drop-shadow-lg"
        >
          The Stage is Set for <br />
          <span className="text-pink-500">Your Favorite Stars 🌟</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed"
        >
          The spotlight is on! Vote for the participants who impressed you the
          most and help crown the champions of this event.
        </motion.p>

        {/* 🧮 Live Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-center"
        >
          {/* Total Participants */}
          <div className="bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-transparent border border-pink-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <h3 className="text-4xl font-bold text-pink-400 mb-2">
              {stats.totalParticipants}
            </h3>
            <p className="text-gray-300 font-medium">Participants Competing</p>
          </div>

          {/* Total Votes */}
          <div className="bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-transparent border border-purple-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <h3 className="text-4xl font-bold text-purple-400 mb-2">
              {stats.totalVotes}
            </h3>
            <p className="text-gray-300 font-medium">Votes Already Cast</p>
          </div>
        </motion.div>

        {/* 👇 Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.4,
            duration: 0.8,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="mt-14 flex justify-center"
        >
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-1">Scroll to Vote</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-4 h-8 border-2 border-pink-400 rounded-full flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 💫 Floating sparkles */}
      <div className="absolute top-10 left-1/4 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-ping"></div>
      <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping"></div>
    </section>
  );
};

export default VotingHero;
