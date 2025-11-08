import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit3, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const PerformerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [performers, setPerformers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    day: "",
    image: null,
  });

  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch events
  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/events`)
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("❌ Failed to load events"));
  }, []);

  // ✅ Fetch performers for selected event
  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(`${BACKEND_URI}/api/performers/event/${selectedEvent}`)
        .then((res) => setPerformers(res.data.performers || []))
        .catch(() => toast.error("❌ Failed to load performers"));
    } else {
      setPerformers([]);
    }
  }, [selectedEvent]);

  // 🧾 Add / Edit Performer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.day || !selectedEvent || !formData.image) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("day", formData.day);
    data.append("eventId", selectedEvent);
    data.append("image", formData.image);

    setLoading(true);

    try {
      let res;
      if (editMode) {
        res = await axios.put(`${BACKEND_URI}/api/performers/${editMode}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data?.message || "✅ Performer updated successfully!");
      } else {
        res = await axios.post(`${BACKEND_URI}/api/performers`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data?.message || "🎤 Performer added successfully!");
      }

      // Reset form
      setFormData({ name: "", role: "", day: "", image: null });
      setEditMode(null);

      // Refresh list
      const updated = await axios.get(`${BACKEND_URI}/api/performers/event/${selectedEvent}`);
      setPerformers(updated.data.performers || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit Performer
  const handleEdit = (p) => {
    setEditMode(p._id);
    setFormData({
      name: p.name,
      role: p.role,
      day: p.day,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("✏️ Edit mode activated", { icon: "📝" });
  };

  // 🗑 Delete Performer
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this performer?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/performers/${id}`);
      setPerformers(performers.filter((p) => p._id !== id));
      toast.success(res.data?.message || "🗑️ Performer deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to delete performer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 md:px-10 py-8 space-y-10">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-400">
        🎤 Manage Performers
      </h1>

      {/* Event Selector */}
      <div className="mb-8">
        <label className="block mb-2 text-gray-400 text-sm sm:text-base">
          Select Event:
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full sm:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">-- Choose an event --</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title} ({new Date(e.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Performer Form */}
      {selectedEvent && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-900 p-5 sm:p-6 md:p-8 rounded-xl shadow-xl border border-gray-800"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
            <PlusCircle className="text-yellow-400" />
            {editMode ? "Edit Performer" : "Add New Performer"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <input
              type="text"
              placeholder="Performer Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-yellow-500"
            />

            <input
              type="text"
              placeholder="Role (e.g. Singer)"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-yellow-500"
            />

            <input
              type="text"
              placeholder="Day (e.g. Day 1)"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-yellow-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full sm:col-span-2 cursor-pointer focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all w-full sm:w-auto"
          >
            {loading
              ? "Uploading..."
              : editMode
              ? "Update Performer"
              : "Add Performer"}
          </button>
        </form>
      )}

      {/* Performer List */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-400">
          Current Performers
        </h2>

        {performers.length === 0 ? (
          <p className="text-gray-400">No performers added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {performers.map((p) => (
              <div
                key={p._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-yellow-500/20 transition-all"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-yellow-400">{p.name}</h3>
                <p className="text-gray-400">{p.role}</p>
                <p className="text-gray-500 text-sm">{p.day}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                  >
                    <Edit3 size={16} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformerDashboard;
