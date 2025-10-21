  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import {
    PlusCircle,
    Trash2,
    Edit3,
    UploadCloud,
    Search,
    Power,
  } from "lucide-react";

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

  const VotingZoneDashboard = () => {
    const [participants, setParticipants] = useState([]);
    const [formData, setFormData] = useState({
      name: "",
      tagNumber: "",
      details: "",
      photo: null,
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [votingLive, setVotingLive] = useState(false);
    const [votingLoading, setVotingLoading] = useState(false);

    // Fetch participants
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(`${BACKEND_URI}/api/participants`);
        setParticipants(res.data.participants || res.data || []);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setParticipants([]);
      }
    };

    // Add this inside VotingZoneDashboard component

// Handle edit participant
const handleEdit = (participant) => {
  setEditId(participant._id); // Set the ID for PUT request
  setFormData({
    name: participant.name || "",
    tagNumber: participant.tagNumber || "",
    details: participant.details || "",
    photo: null, // Keep null; user can upload new photo if needed
  });
  window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
};


    // Fetch live voting status
    const fetchVotingStatus = async () => {
      try {
        const res = await axios.get(`${BACKEND_URI}/api/config/status`);
        setVotingLive(res.data.isLive || false);
      } catch (err) {
        console.error("Error fetching voting status:", err);
      }
    };

    useEffect(() => {
      fetchParticipants();
      fetchVotingStatus();
    }, []);

    // Add / Edit participant
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const token = localStorage.getItem("token");

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      try {
        if (editId) {
          await axios.put(`${BACKEND_URI}/api/participants/${editId}`, form, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          await axios.post(`${BACKEND_URI}/api/participants`, form, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        }
        setFormData({ name: "", tagNumber: "", details: "", photo: null });
        setEditId(null);
        fetchParticipants();
      } catch (err) {
        console.error("Error saving participant:", err);
        alert("Error saving participant.");
      } finally {
        setLoading(false);
      }
    };

    // Delete participant
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this participant?")) return;
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${BACKEND_URI}/api/participants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchParticipants();
      } catch (err) {
        console.error("Error deleting participant:", err);
      }
    };

    // Toggle voting live
    const toggleVotingLive = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin.");
        return;
      }

      try {
        setVotingLoading(true);
        const newStatus = !votingLive;

        const res = await axios.post(
          `${BACKEND_URI}/api/config/toggle/live`,
          { isLive: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setVotingLive(newStatus);
        alert(res.data.message);
      } catch (err) {
        console.error("Error toggling voting:", err);
        alert("Failed to update status");
      } finally {
        setVotingLoading(false);
      }
    };

    // Filter participants
    const filtered = participants.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏆 Manage Participants
            </h1>

            <button
              onClick={toggleVotingLive}
              disabled={votingLoading}
              className={`px-5 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                votingLive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Power size={18} />
              {votingLoading
                ? "Updating..."
                : votingLive
                ? "Voting Live 🟢"
                : "Voting Soon 🔴"}
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Participant" : "Add New Participant"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Tag Number"
                value={formData.tagNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tagNumber: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.files[0] })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 md:col-span-2"
              />
            </div>
            <textarea
              placeholder="Details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-4 focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <UploadCloud size={18} />
              {loading ? "Saving..." : editId ? "Update" : "Add"}
            </button>
          </form>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search participants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-900/80 rounded-xl border border-gray-700 shadow-lg hover:shadow-purple-500/30 transition-all overflow-hidden"
                >
                  <img
                    src={p.photoUrl || "https://via.placeholder.com/300x200"}
                    alt={p.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-gray-400 text-sm">Tag: {p.tagNumber}</p>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {p.details}
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-black flex items-center gap-1"
                      >
                        <Edit3 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400">
                No participants found.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default VotingZoneDashboard;
