import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UploadCloud, Edit3, X } from "lucide-react";

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
  const [editingId, setEditingId] = useState(null); // 🆕 track edit mode

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
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

  // Time formatting
  const formatTime = (time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const combinedTime = `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`;
    const data = new FormData();
    Object.entries({ ...formData, time: combinedTime }).forEach(([k, v]) => data.append(k, v));

    try {
      if (editingId) {
        // 🆕 Edit existing event
        await axios.put(`${BACKEND_URI}/api/events/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Event updated successfully!");
      } else {
        // ➕ Add new event
        await axios.post(`${BACKEND_URI}/api/events/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Event added successfully!");
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Handle edit
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
  };

  // 🆕 Reset form
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

  // Delete event
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${BACKEND_URI}/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      {/* Form Section */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "✏️ Edit Event" : "🎫 Add New Event"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-red-400 flex items-center gap-1"
            >
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 text-gray-300">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="day"
            placeholder="Day (auto-filled)"
            value={formData.day}
            readOnly
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 opacity-80 cursor-not-allowed"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            required
          />

          {/* Start & End Time */}
          <div className="flex items-center gap-3 md:col-span-2">
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-400 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-sm text-gray-400 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
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
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 md:col-span-2"
          />

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 md:col-span-2">
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
            } transition text-white font-medium py-2 rounded-lg md:col-span-2`}
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
      <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📅 All Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm">
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
                <tr key={event._id} className="hover:bg-gray-800">
                  <td className="p-2 border border-gray-700">{event.title}</td>
                  <td className="p-2 border border-gray-700">{event.date}</td>
                  <td className="p-2 border border-gray-700">{event.day}</td>
                  <td className="p-2 border border-gray-700">{event.time}</td>
                  <td className="p-2 border border-gray-700">{event.location}</td>
                  <td className="p-2 border border-gray-700">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt="event"
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2 border border-gray-700 text-center space-x-3">
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
