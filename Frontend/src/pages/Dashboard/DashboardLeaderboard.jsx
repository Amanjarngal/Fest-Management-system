import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const DashboardLeaderboard = () => {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [top3, setTop3] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const token = localStorage.getItem("token"); // Admin token

  // ✅ Fetch leaderboard data (always show regardless of live status)
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Get live status
      const statusRes = await axios.get(`${BACKEND_URI}/api/leaderboard/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLive(statusRes.data.isLeaderboardLive || false);

      // Fetch all leaderboard data (admin access)
      const leaderboardRes = await axios.get(`${BACKEND_URI}/api/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTop3(leaderboardRes.data.top3 || []);
      setAllParticipants(leaderboardRes.data.allParticipants || []);
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // ✅ Toggle leaderboard live status (for public visibility)
  const handleToggle = async () => {
    try {
      const newLiveState = !isLive;
      setIsLive(newLiveState); // optimistic update

      const res = await axios.post(
        `${BACKEND_URI}/api/leaderboard/toggle`,
        { isLive: newLiveState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Leaderboard status updated successfully");
    } catch (err) {
      console.error("Error toggling leaderboard:", err);
      alert(err.response?.data?.error || "Error toggling leaderboard");
      setIsLive(!isLive); // revert on failure
    }
  };

  if (loading)
    return (
      <div className="text-white text-center py-10">
        <p>Loading leaderboard...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 🔧 Admin Controls */}
      <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg mb-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Leaderboard Control</h1>
        <p className="mb-4">
          Current Status:{" "}
          <span className={isLive ? "text-green-400" : "text-red-400"}>
            {isLive ? "Live ✅" : "Not Live ❌"}
          </span>
        </p>
        <button
          onClick={handleToggle}
          className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all ${
            isLive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLive ? "Deactivate Leaderboard" : "Activate Leaderboard"}
        </button>
      </div>

      {/* 🏆 Top 3 Performers */}
      {top3.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🏆 Top 3 Participants
          </h2>
          <div className="flex justify-center gap-6 flex-wrap mb-12">
            {top3.map((p, i) => (
              <div
                key={p._id}
                className="bg-yellow-500 p-6 rounded-2xl shadow-xl w-64 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <img
                    src={p.photoUrl || "https://via.placeholder.com/150"}
                    alt={p.name}
                    className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-md mb-3 object-cover"
                  />
                  <span className="absolute top-0 right-3 bg-white text-black text-sm font-bold px-2 py-1 rounded-full shadow">
                    #{i + 1}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-black font-bold">{p.votes} Votes</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 👥 All Participants */}
      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        All Participants
      </h2>
      {allParticipants.length === 0 ? (
        <p className="text-gray-300 text-center">No participants found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allParticipants.map((p) => (
            <div
              key={p._id}
              className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 text-center"
            >
              <img
                src={p.photoUrl || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-20 h-20 mx-auto rounded-full border-2 border-purple-400 mb-2 object-cover"
              />
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="text-purple-300 font-bold">{p.votes} Votes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLeaderboard;
