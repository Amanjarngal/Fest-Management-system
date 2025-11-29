import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Loader2,
} from "lucide-react";
import MyTickets from "../components/my Account/MyTickets";
import MyStallOrders from "../components/my Account/MyStallOrders";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("tickets");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRole(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken(true);

      const res = await axios.get(`${BACKEND_URI}/api/stalls/my-stalls`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRole(res.data.role || "user");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast.error("Failed to load your account role.");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <Loader2 className="animate-spin mr-2" /> Loading account...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-black">
        <p>Please log in to view your account.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white py-12 px-6">
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <User /> {user.displayName || "User Account"}
            </h1>
            <p className="flex items-center gap-2 text-gray-300">
              <Mail /> {user.email}
            </p>
          </div>

          {/* Role Badge */}
          <div>
            <span
              className={`${
                role === "stallOwner"
                  ? "bg-green-600"
                  : role === "admin"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
              } px-4 py-1 rounded-full font-semibold`}
            >
              {role === "stallOwner"
                ? "Stall Owner"
                : role === "admin"
                ? "Admin"
                : "Regular User"}
            </span>
          </div>
        </div>

        {/* ==================== TABS ==================== */}
        <div className="mt-10">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-2 rounded-xl font-semibold transition ${
                activeTab === "tickets"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              🎟️ My Event Tickets
            </button>

            <button
              onClick={() => setActiveTab("stallOrders")}
              className={`px-6 py-2 rounded-xl font-semibold transition ${
                activeTab === "stallOrders"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              🍽️ My Stall Orders
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "tickets" && <MyTickets />}
          {activeTab === "stallOrders" && <MyStallOrders />}
        </div>

        {/* 🚫 Stall Owner Actions Removed */}
        {role === "stallOwner" && (
          <p className="text-gray-400 mt-10 text-center text-lg">
            You can manage your stalls inside the{" "}
            <span className="text-pink-400 font-bold">Stall Owner Dashboard</span>.
            <br />
            (Menu items, earnings, orders, everything is moved there)
          </p>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
