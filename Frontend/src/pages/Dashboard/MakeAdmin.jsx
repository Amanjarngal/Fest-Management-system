import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Auth

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MakeAdmin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth(); // ✅ Firebase instance

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("⚠️ Please log in as an admin first!");
      return null;
    }
    return await user.getIdToken(true); // refreshes the token
  };

  const fetchAdmins = async () => {
    try {
      setRefreshing(true);
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${BACKEND_URI}/api/admin/list-admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(res.data.admins || []);
      toast.success("✅ Admin list updated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch admins");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleGrantAdmin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("⚠️ Please enter an email");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.post(
        `${BACKEND_URI}/api/admin/make-admin`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data?.message || "✅ Admin access granted!");
      setEmail("");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "❌ Failed to grant admin access");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminEmail) => {
    if (!confirm(`Remove admin access from ${adminEmail}?`)) return;

    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.post(
        `${BACKEND_URI}/api/admin/remove-admin`,
        { email: adminEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message || "🗑️ Admin removed successfully!");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "❌ Failed to remove admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-purple-950 p-6 flex flex-col items-center text-white">
      
      {/* Grant Admin Form */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md mb-10 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Grant Admin Access
        </h2>
        <form onSubmit={handleGrantAdmin} className="space-y-4">
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/50"
          >
            {loading ? "Granting..." : "Grant Admin Access"}
          </button>
        </form>
      </div>

      {/* Admin List */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-purple-400">
            Current Admins ({admins.length})
          </h2>
          <button
            onClick={fetchAdmins}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-semibold shadow-md hover:shadow-purple-500/40 transition-all"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {refreshing ? (
          <p className="text-gray-400">Loading admins...</p>
        ) : admins.length > 0 ? (
          <div className="grid gap-4">
            {admins.map((admin) => (
              <div
                key={admin.uid}
                className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 hover:shadow-purple-500/40 transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
              >
                <span className="text-white font-medium break-all">
                  {admin.email}
                </span>
                <button
                  onClick={() => handleRemoveAdmin(admin.email)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-2 text-white w-full sm:w-auto justify-center transition-all"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No admins found.</p>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
