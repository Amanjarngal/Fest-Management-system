import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCcw,
  Trash2,
  Search,
  Star,
  Loader2,
} from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URI}/api/feedback`);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      alert("Failed to load feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);


  // ✅ Handle refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchFeedbacks();
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Search filter
  const filtered = feedbacks.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            💬 Manage Feedback
          </h1>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2 font-semibold transition-all"
          >
            <RefreshCcw size={18} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-pink-500 w-10 h-10" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-10">
            No feedback found. 🌙
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((f) => (
              <div
                key={f._id}
                className="bg-gray-900/80 rounded-xl border border-gray-700 shadow-lg  transition-all overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-pink-400">
                      {f.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{f.email}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i <= f.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm italic line-clamp-3">
                    “{f.feedback}”
                  </p>

                  <p className="text-gray-500 text-xs">
                    {new Date(f.createdAt).toLocaleString()}
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDashboard;
