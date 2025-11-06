import React, { useState, useEffect } from "react";
import axios from "axios";
import { Crown } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Leaderboard = () => {
  const [participants, setParticipants] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch top 3 participants
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URI}/api/leaderboard`);
      setParticipants(res.data.top3 || []);
      setIsLive(true);
    } catch (err) {
      if (err.response?.status === 403) {
        setIsLive(false); // Leaderboard not live
      } else {
        console.error("Error fetching leaderboard:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="text-white text-center py-10">
        <p>Loading leaderboard...</p>
      </div>
    );

  // ✅ If not live, show nothing
  if (!isLive) return null;

  const medals = ["🥇", "🥈", "🥉"];
  const colors = [
    "from-yellow-400 via-yellow-500 to-orange-500",
    "from-gray-400 via-gray-500 to-gray-600",
    "from-orange-400 via-pink-500 to-red-500",
  ];

  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl text-white font-bold mb-6 flex items-center justify-center gap-2">
        <Crown className="text-amber-300" /> Top Performers
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {participants.map((p, i) => (
          <div
            key={p._id}
            className={`relative bg-gradient-to-br ${colors[i % 3]} p-[2px] rounded-2xl shadow-lg`}
          >
            <div className="bg-gray-900 rounded-2xl px-6 py-5 text-center w-52">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">
                {medals[i] || ""}
              </div>
              <img
                src={p.photoUrl || "https://via.placeholder.com/100"}
                alt={p.name}
                className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-300 mb-3 object-cover"
              />
              <h3 className="font-semibold text-white text-lg mb-1">{p.name}</h3>
              <p className="text-yellow-300 font-bold">{p.votes || 0} Votes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
