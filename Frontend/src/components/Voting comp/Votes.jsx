import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Leaderboard from "./Leaderboard";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Loader from "../Loader"; // ✅ Import Loader component

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Votes = () => {
  const [participants, setParticipants] = useState([]);
  const [votingLive, setVotingLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInitialData();
    fetchUserVotes();

    const socket = io(BACKEND_URI, { transports: ["websocket"] });
    socket.on("voteUpdate", (data) => {
      setParticipants((prev) =>
        prev.map((p) => (p._id === data.id ? { ...p, votes: data.votes } : p))
      );
    });
    socket.on("votingStatus", (status) => setVotingLive(status.isLive));
    return () => socket.disconnect();
  }, []);

  const fetchUserVotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${BACKEND_URI}/api/votes/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotedIds(res.data.voted || []);
    } catch (err) {
      console.error("Error fetching user votes:", err);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [statusRes, participantsRes] = await Promise.all([
        axios.get(`${BACKEND_URI}/api/config/status`),
        axios.get(`${BACKEND_URI}/api/participants`),
      ]);
      setVotingLive(statusRes.data.isLive || false);
      setParticipants(participantsRes.data.participants || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to vote!");
      await axios.post(`${BACKEND_URI}/api/votes/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotedIds((prev) => [...prev, id]);
      toast.success("Vote submitted!", { duration: 2000 });
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Something went wrong while voting.");
    }
  };

  // ✅ Use the common Loader here
  if (loading) return <Loader text="Fetching Votes..." />;

  if (!votingLive)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-white animate-pulse">
          Voting Coming Soon 🕒
        </h1>
        <p className="text-xl text-gray-300">
          Stay tuned — the event will go live shortly!
        </p>
      </div>
    );

  const sortedParticipants = [...participants].sort(
    (a, b) => (b.votes || 0) - (a.votes || 0)
  );
  const filteredParticipants = sortedParticipants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-600/20 blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* Header */}
      <div className="text-center mb-12 px-6 relative z-10">
        <p className="text-pink-400 text-sm font-semibold tracking-widest mb-2">// Live Voting //</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-snug">
          Vote for Your <span className="text-pink-500">Favorite Star ✨</span>
        </h2>
      </div>

      {/* Leaderboard */}
      <Leaderboard participants={sortedParticipants.slice(0, 3)} />

      {/* Search bar */}
      <div className="relative max-w-md mx-auto mt-12 mb-12">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search participant by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-full border border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 placeholder-gray-400"
        />
      </div>
      {/* ⚠️ Important Voting Rule */}
<div className="relative z-10 max-w-3xl mx-auto text-center mt-6 mb-10">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-gradient-to-r from-pink-600/10 via-purple-700/10 to-pink-600/10 border border-pink-500/30 rounded-2xl py-4 px-6 backdrop-blur-md shadow-lg"
  >
    <p className="text-base sm:text-lg text-transparent bg-clip-text bg-white to-white font-semibold leading-relaxed">
      ⚠️ Once a vote is cast, it <span className="text-pink-400 font-bold">cannot be modified or withdrawn</span>. 
      Please review your choice carefully before submitting your vote.
    </p>
  </motion.div>
</div>


      {/* Voting cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-items-center"
          >
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((p) => {
                const hasVoted = votedIds.includes(p._id);
                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group relative flex flex-col items-center text-center bg-gradient-to-br from-gray-900 via-gray-800/70 to-black rounded-3xl border border-pink-500/20 shadow-lg hover:shadow-pink-500/40 p-8 transition-all duration-500"
                  >
                    <motion.img
                      src={p.photoUrl || "https://via.placeholder.com/300"}
                      alt={p.name}
                      className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-pink-500/30 shadow-xl"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />
                    <h3 className="mt-5 text-2xl font-semibold text-white group-hover:text-pink-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">⭐ {p.votes || 0} Votes</p>
                    <motion.button
  onClick={() => handleVote(p._id)}
  disabled={hasVoted || !votingLive}
  whileHover={!hasVoted && votingLive ? { scale: 1.1 } : {}}
  className={`mt-5 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
    hasVoted
      ? "bg-gradient-to-r from-green-700 to-emerald-600 cursor-not-allowed text-white"
      : !votingLive
      ? "bg-gray-700/70 cursor-not-allowed text-gray-400 border border-gray-600"
      : "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
  }`}
>
  {hasVoted
    ? "Voted ✅"
    : !votingLive
    ? "Voting Closed 🏁"
    : "Vote Now"}
</motion.button>

                  </motion.div>
                );
              })
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-gray-400 text-lg"
              >
                No participants found.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient edges */}
      <div className="absolute left-0 top-0 h-full w-24 sm:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-24 sm:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Votes;
