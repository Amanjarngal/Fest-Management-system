import React, { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const AnnouncementModal = ({ isOpen, onClose }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧭 Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/announcements`);
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchAnnouncements();

    // ⚡ Real-time Socket Updates
    const socket = io(BACKEND_URI, { transports: ["websocket"] });
    socket.on("newAnnouncement", (data) => {
      setAnnouncements((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/20 rounded-2xl shadow-2xl w-full max-w-lg relative p-6 text-white max-h-[80vh] overflow-y-auto">
        {/* ✨ Header */}
        <div className="flex justify-between items-center mb-4 border-b border-pink-500/30 pb-3">
          <h2 className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-white">
            <Megaphone className="text-pink-400" /> Announcements
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-400 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* ✨ Loading & Empty State */}
        {loading ? (
          <p className="text-center text-gray-400 py-6">Fetching announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No announcements yet.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="bg-gradient-to-br from-gray-800/60 via-gray-900/80 to-black border border-pink-500/20 rounded-xl p-4 hover:border-pink-500/40 hover:shadow-pink-500/10 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 text-pink-400">
                  <Megaphone size={18} className="text-pink-500" /> {a.title}
                </h3>
                <p className="text-gray-200 mt-1 leading-relaxed">{a.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  🕒 {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementModal;
