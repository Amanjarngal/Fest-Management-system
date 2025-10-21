import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const VotingZone = () => {
  const [participants, setParticipants] = useState([]);
  const [votingLive, setVotingLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]); // Track voted participants

  useEffect(() => {
    fetchInitialData();
    fetchUserVotes();

    const socket = io(BACKEND_URI, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("voteUpdate", (data) => {
      setParticipants((prev) =>
        prev.map((p) => (p._id === data.id ? { ...p, votes: data.votes } : p))
      );
    });

    socket.on("votingStatus", (status) => {
      setVotingLive(status.isLive);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch user votes from backend
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

  // Fetch participants and voting status
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

  // Handle vote action
  const handleVote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to vote!");

      await axios.post(`${BACKEND_URI}/api/votes/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVotedIds((prev) => [...prev, id]);
      alert("✅ Vote submitted!");
    } catch (err) {
      alert(err.response?.data?.error || "Error voting");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading participants...
      </div>
    );

  if (!votingLive)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 text-white text-center">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">
          Voting Coming Soon 🕒
        </h1>
        <p className="text-xl">Stay tuned — the event will go live shortly!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-purple-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Vote for Your Favorite ✨
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.length > 0 ? (
          participants.map((p) => {
            const hasVoted = votedIds.includes(p._id);
            return (
              <div key={p._id} className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <img
                  src={p.photoUrl || "https://via.placeholder.com/150"}
                  alt={p.name}
                  className="w-32 h-32 rounded-full border-4 border-purple-600 object-cover mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
                <p className="text-purple-400 text-sm mb-4">Votes: {p.votes || 0}</p>
                <button
                  onClick={() => handleVote(p._id)}
                  disabled={hasVoted}
                  className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all ${
                    hasVoted
                      ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/50"
                  }`}
                >
                  {hasVoted ? "Voted ✅" : "Vote"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No participants found.
          </p>
        )}
      </div>
    </div>
  );
};

export default VotingZone;
