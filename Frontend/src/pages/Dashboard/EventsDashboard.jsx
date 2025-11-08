import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UploadCloud, Edit3, X } from "lucide-react";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const EventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    day: "",
    date: "",
    location: "",
    startTime: "",
    endTime: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      const selectedDate = new Date(value);
      const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
      setFormData((prev) => ({ ...prev, [name]: value, day: dayName }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // Format Time
  const formatTime = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Add / Update Event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const combinedTime = `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`;
    const data = new FormData();
    Object.entries({ ...formData, time: combinedTime }).forEach(([k, v]) => data.append(k, v));

    try {
      let res;
      if (editingId) {
        res = await axios.put(`${BACKEND_URI}/api/events/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "✅ Event updated successfully!");
      } else {
        res = await axios.post(`${BACKEND_URI}/api/events/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "✅ Event added successfully!");
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  // Edit Event
  const handleEdit = (event) => {
    const [start, end] = event.time?.split(" - ") || ["", ""];
    setFormData({
      title: event.title,
      day: event.day,
      date: event.date,
      location: event.location,
      startTime: start,
      endTime: end,
      description: event.description,
      image: null,
    });
    setPreview(event.imageUrl);
    setEditingId(event._id);
    toast("✏️ Edit mode enabled", { icon: "📝" });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      day: "",
      date: "",
      location: "",
      startTime: "",
      endTime: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/events/${id}`);
      toast.success(res.data.message || "🗑️ Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Failed to delete event");
    }
  };

  return (
    <div className="space-y-10 px-4 sm:px-6 md:px-10 py-6 max-w-7xl mx-auto">
      {/* Form Section */}
      <div className="bg-gray-900 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {editingId ? "✏️ Edit Event" : "🎫 Add New Event"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-red-400 flex items-center gap-1 text-sm"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 text-gray-300"
        >
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 w-full"
            required
          />
          <input
            type="text"
            name="day"
            placeholder="Day (auto-filled)"
            value={formData.day}
            readOnly
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 opacity-80 cursor-not-allowed w-full"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 w-full"
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:col-span-2">
            <div className="flex flex-col flex-1 mb-3 sm:mb-0">
              <label className="text-sm text-gray-400 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 w-full"
                required
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm text-gray-400 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 w-full"
                required
              />
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 sm:col-span-2 w-full"
          />

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 sm:col-span-2 w-full text-center">
            <label className="cursor-pointer flex flex-col items-center">
              <UploadCloud size={28} className="text-purple-500" />
              <span className="text-sm mt-2">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-700"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              editingId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-purple-600 hover:bg-purple-700"
            } transition text-white font-medium py-2 rounded-lg sm:col-span-2`}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Event"
              : "Add Event"}
          </button>
        </form>
      </div>

      {/* Event List */}
      <div className="bg-gray-900 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">📅 All Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm sm:text-base">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-2 border border-gray-700">Title</th>
                <th className="p-2 border border-gray-700">Date</th>
                <th className="p-2 border border-gray-700">Day</th>
                <th className="p-2 border border-gray-700">Time</th>
                <th className="p-2 border border-gray-700">Location</th>
                <th className="p-2 border border-gray-700">Image</th>
                <th className="p-2 border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-800 transition">
                  <td className="p-2 border border-gray-700">{event.title}</td>
                  <td className="p-2 border border-gray-700">{event.date}</td>
                  <td className="p-2 border border-gray-700">{event.day}</td>
                  <td className="p-2 border border-gray-700">{event.time}</td>
                  <td className="p-2 border border-gray-700">{event.location}</td>
                  <td className="p-2 border border-gray-700 text-center">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt="event"
                        className="w-12 h-12 rounded object-cover mx-auto"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2 border border-gray-700 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-yellow-400 hover:text-yellow-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-400">
                    No events added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;
