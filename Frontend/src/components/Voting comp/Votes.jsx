import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Leaderboard from "./Leaderboard"; // Import the new component

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Votes = () => {
  const [participants, setParticipants] = useState([]);
  const [votingLive, setVotingLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState([]);

  useEffect(() => {
    fetchInitialData();
    fetchUserVotes();

    const socket = io(BACKEND_URI, { transports: ["websocket"] });

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

  // Sort participants by votes (for leaderboard)
  const sortedParticipants = [...participants].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <> 
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-purple-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Vote for Your Favorite ✨
      </h1>

      

      {/* Voting Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
        {participants.length > 0 ? (
          participants.map((p) => {
            const hasVoted = votedIds.includes(p._id);
            return (
              <div
                key={p._id}
                className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-lg hover:shadow-purple-500/30 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <img
                    src={p.photoUrl || "https://via.placeholder.com/150"}
                    alt={p.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-purple-500 shadow-md object-cover"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2">{p.name}</h2>

                {/* Fancy glowing vote meter */}
                <div className="w-full bg-gray-700/40 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400"
                    style={{ width: `${Math.min((p.votes || 0) * 5, 100)}%` }}
                  ></div>
                </div>

                <p className="text-sm text-purple-300 mb-4">
                  ⭐ {p.votes || 0} Votes
                </p>

                <button
                  onClick={() => handleVote(p._id)}
                  disabled={hasVoted}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    hasVoted
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105"
                  }`}
                >
                  {hasVoted ? "Voted ✅" : "Vote Now"}
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
       {/* Leaderboard Section */}
      <Leaderboard participants={sortedParticipants.slice(0, 3)} />
    </div>
   
      
      </>
  );
};

export default Votes;
