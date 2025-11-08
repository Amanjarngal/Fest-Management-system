import React, { useEffect, useState } from "react";
import axios from "axios";
import { QrCode, RefreshCw, Trash2, Plus, Mail, Edit, X } from "lucide-react";
import QRModal from "../../components/Dashboard components/QRModal";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Stalls = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  // ✅ New state for Edit Modal
  const [editingStall, setEditingStall] = useState(null);

  const [newStall, setNewStall] = useState({
    name: "",
    category: "",
    location: "",
    ownerName: "",
    ownerEmail: "",
    description: "",
  });

  const fetchStalls = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/stalls`);
      setStalls(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stalls:", error);
      toast.error("Failed to load stalls");
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

 // ✅ Create Stall (Admin Only)
const handleCreateStall = async (e) => {
  e.preventDefault();
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return toast.error("You must be logged in as admin!");
    const token = await user.getIdToken(true);

    const stallData = {
      ...newStall,
      ownerUID: user.uid,
      email: newStall.ownerEmail, // ✅ field name fixed
    };

    await axios.post(`${BACKEND_URI}/api/stalls`, stallData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success(`✅ Stall "${newStall.name}" created successfully!`);
    setNewStall({
      name: "",
      category: "",
      location: "",
      ownerName: "",
      ownerEmail: "",
      description: "",
    });
    fetchStalls();
  } catch (error) {
    console.error("Error creating stall:", error);
    toast.error(
      error.response?.data?.message ||
        "Failed to create stall. Ensure all fields are valid."
    );
  }
};


  // ✅ Reset tokens
  const handleReset = async (id) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return toast.error("Login required");

      const token = await user.getIdToken(true);
      await axios.post(`${BACKEND_URI}/api/stalls/${id}/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Tokens reset successfully");
      fetchStalls();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset tokens");
    }
  };

  // ✅ Delete stall
  const handleDelete = async (id) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return toast.error("Login required");
      const token = await user.getIdToken(true);

      if (!window.confirm("Are you sure you want to delete this stall?")) return;

      await axios.delete(`${BACKEND_URI}/api/stalls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🗑️ Stall deleted successfully");
      fetchStalls();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete stall");
    }
  };

  // ✅ Edit Stall - Open Modal
  const handleEditClick = (stall) => {
    setEditingStall({ ...stall }); // clone the stall data
  };

  // ✅ Handle Update Stall
  const handleUpdateStall = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return toast.error("Login required");

      const token = await user.getIdToken(true);

      await axios.put(`${BACKEND_URI}/api/stalls/${editingStall._id}`, editingStall, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✏️ Stall updated successfully!");
      setEditingStall(null);
      fetchStalls();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stall");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-yellow-400 text-lg animate-pulse">
        Loading Stalls...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white p-8 md:p-10">
      {/* Header + Add Form */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          🏪 Manage Stalls
        </h1>

        {/* Inline Add Stall Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Plus size={22} /> Add a New Stall
          </h2>
          <form onSubmit={handleCreateStall} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {["name", "category", "location", "ownerName", "ownerEmail"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-400 mb-1">
                  {field === "ownerEmail"
                    ? "Stall Owner Email (for access):"
                    : field.charAt(0).toUpperCase() + field.slice(1) + ":"}
                </label>
                <input
                  type={field === "ownerEmail" ? "email" : "text"}
                  name={field}
                  value={newStall[field]}
                  onChange={(e) =>
                    setNewStall({ ...newStall, [e.target.name]: e.target.value })
                  }
                  placeholder={`Enter ${field}`}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required={field === "name" || field === "ownerEmail"}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description:</label>
              <textarea
                name="description"
                value={newStall.description}
                onChange={(e) =>
                  setNewStall({ ...newStall, description: e.target.value })
                }
                placeholder="Enter stall description"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
              />
            </div>

            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition"
              >
                Create Stall & Assign Owner
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stall Cards */}
      {stalls.length === 0 ? (
        <p className="text-gray-400 text-center mt-16 text-lg">
          No stalls created yet. Fill the form above to add one.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stalls.map((stall) => (
            <div
              key={stall._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-yellow-500/20 transition-all"
            >
              <h2 className="text-xl font-semibold text-yellow-400 mb-3">{stall.name}</h2>
              <p className="text-gray-400 text-sm mb-1">📍 {stall.location || "Not specified"}</p>
              <p className="text-gray-400 text-sm mb-1">👤 {stall.ownerName || "Unknown Owner"}</p>
              <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
                <Mail size={14} /> {stall.ownerEmail || "No contact email"}
              </p>
              <p className="text-yellow-300 font-medium mb-3">
                🎟️ Current Token:{" "}
                <span className="text-yellow-400 font-bold">{stall.currentToken}</span>
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedQR(stall.qrCodeDataUrl);
                    setShowQR(true);
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  <QrCode size={16} /> QR
                </button>

                <button
                  onClick={() => handleReset(stall._id)}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  <RefreshCw size={16} /> Reset
                </button>

                <button
                  onClick={() => handleEditClick(stall)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  <Edit size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(stall._id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingStall && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStall(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">✏️ Edit Stall</h2>
            <form onSubmit={handleUpdateStall} className="space-y-4">
              {["name", "category", "location", "ownerName", "ownerEmail", "description"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-400 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={editingStall[field] || ""}
                      onChange={(e) =>
                        setEditingStall({
                          ...editingStall,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                )
              )}
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition"
              >
                Update Stall
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <QRModal
          qrCode={selectedQR}
          onClose={() => {
            setSelectedQR(null);
            setShowQR(false);
          }}
        />
      )}
    </div>
  );
};

export default Stalls;
