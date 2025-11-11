import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  Edit3,
  UploadCloud,
  Search,
  Power,
  RefreshCcw,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Participants = () => {
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
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch participants
  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/participants`);
      setParticipants(res.data.participants || res.data || []);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setParticipants([]);
    }
  };

  // ✅ Fetch live voting status
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

    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Edit participant
  const handleEdit = (participant) => {
    setEditId(participant._id);
    setFormData({
      name: participant.name || "",
      tagNumber: participant.tagNumber || "",
      details: participant.details || "",
      photo: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Add or Update participant
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
      if (editId) {
        await axios.put(`${BACKEND_URI}/api/participants/${editId}`, form, {
          headers,
        });
        toast.success("✅ Participant updated!");
      } else {
        await axios.post(`${BACKEND_URI}/api/participants`, form, { headers });
        toast.success("🎉 Participant added!");
      }

      setFormData({ name: "", tagNumber: "", details: "", photo: null });
      setEditId(null);
      fetchParticipants();
    } catch (err) {
      console.error("Error saving participant:", err);
      toast.error("Error saving participant.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete participant
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this participant?")) return;
    try {
      await axios.delete(`${BACKEND_URI}/api/participants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Deleted successfully");
      fetchParticipants();
    } catch (err) {
      console.error("Error deleting participant:", err);
    }
  };

  // ✅ Toggle voting live
  const toggleVotingLive = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Please login as admin.");
        return;
      }

      const token = await user.getIdToken();
      const newStatus = !votingLive;
      setVotingLoading(true);

      const res = await axios.post(
        `${BACKEND_URI}/api/config/toggle/live`,
        { isLive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVotingLive(newStatus);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Error toggling voting:", err);
      toast.error(
        err.response?.status === 403
          ? "Access denied: Admin only."
          : "Failed to update voting status."
      );
    } finally {
      setVotingLoading(false);
    }
  };

  // ✅ Search filter
  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen  text-white px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center sm:text-left">
             Manage Participants
          </h1>

          <div className="flex flex-wrap justify-center gap-3">
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

            <button
              onClick={fetchParticipants}
              disabled={refreshing}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2 font-semibold"
            >
              <RefreshCcw size={18} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            {editId ? "Edit Participant ✏️" : "Add New Participant ➕"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              placeholder="Tag Number"
              value={formData.tagNumber}
              onChange={(e) =>
                setFormData({ ...formData, tagNumber: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.files[0] })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-purple-500 sm:col-span-2"
            />
          </div>

          <textarea
            placeholder="Details"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mt-4 focus:ring-2 focus:ring-purple-500"
            rows={3}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg flex justify-center items-center gap-2 font-semibold transition-all"
          >
            <UploadCloud size={18} />
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </form>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96 mx-auto sm:mx-0">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p._id}
                className="bg-gray-900/80 rounded-xl border border-gray-700 shadow-md hover:shadow-purple-500/30 transition-all overflow-hidden"
              >
                <img
                  src={p.photoUrl || "https://via.placeholder.com/400x300"}
                  alt={p.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-yellow-400">{p.name}</h3>
                  <p className="text-gray-400 text-sm">Tag: {p.tagNumber}</p>
                  <p className="text-gray-300 text-sm line-clamp-3">{p.details}</p>
                  <p className="mt-1 text-green-400 font-bold text-lg">
                    Votes: {p.votes || 0}
                  </p>

                  <div className="flex justify-end gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-black flex items-center gap-1 text-sm font-medium"
                    >
                      <Edit3 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-10">
              No participants found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;
