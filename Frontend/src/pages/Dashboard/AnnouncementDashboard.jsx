import React, { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Edit, Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const AnnouncementDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch All Announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/announcements`);
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      toast.error("Failed to fetch announcements.");
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    // ⚡ Real-time update
    const socket = io(BACKEND_URI, { transports: ["websocket"] });
    socket.on("newAnnouncement", (data) => {
      toast.success(`📢 New: ${data.title}`);
      setAnnouncements((prev) => [data, ...prev]);
    });
    return () => socket.disconnect();
  }, []);

  // ✏️ Input Change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🚀 Create / Update Announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message)
      return toast.error("All fields are required!");

    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingId) {
        await axios.put(
          `${BACKEND_URI}/api/announcements/${editingId}`,
          formData,
          { headers }
        );
        toast.success("Announcement updated!");
      } else {
        await axios.post(`${BACKEND_URI}/api/announcements`, formData, {
          headers,
        });
        toast.success("Announcement created!");
      }
      setFormData({ title: "", message: "" });
      setEditingId(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(`${BACKEND_URI}/api/announcements/${id}`, { headers });
      toast.success("Deleted successfully!");
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch {
      toast.error("Failed to delete announcement.");
    }
  };

  // 🛠 Edit Mode
  const handleEdit = (a) => {
    setEditingId(a._id);
    setFormData({ title: a.title, message: a.message });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Megaphone className="text-yellow-400" /> Manage Announcements
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl mb-10"
      >
        <h2 className="text-xl font-semibold text-white">
          {editingId ? "✏️ Edit Announcement" : "📢 Add New Announcement"}
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Announcement Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <textarea
          name="message"
          rows="3"
          placeholder="Announcement Message..."
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition-colors text-black font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle size={18} />
          {editingId ? "Update" : "Post"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-5">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div
              key={a._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex justify-between items-start shadow-md hover:shadow-yellow-400/10 transition-all"
            >
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-yellow-500" /> {a.title}
                </h3>
                <p className="text-gray-300 mt-1">{a.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(a)}
                  className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg flex items-center gap-1 text-sm transition-all"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="bg-red-600 hover:bg-red-500 p-2 rounded-lg flex items-center gap-1 text-sm transition-all"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">
            No announcements yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementDashboard;
