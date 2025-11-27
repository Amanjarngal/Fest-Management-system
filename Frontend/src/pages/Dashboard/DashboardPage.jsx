import React, { useEffect, useState } from "react";
import { Users, Star, Ticket, Store, Coins } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { getAuth } from "firebase/auth";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const COLORS = ["#ec4899", "#8b5cf6", "#facc15", "#22c55e"];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [userGraphData, setUserGraphData] = useState([]);
  const [topParticipants, setTopParticipants] = useState([]); // ✅ new state
  const [loading, setLoading] = useState(false);

  // ✅ Fetch combined dashboard stats
  const fetchStats = async () => {
  const res = await axios.get(`${BACKEND_URI}/api/dashboard/summary`);
  setStats(res.data);
  setTopParticipants(res.data.participantVotes.slice(0, 5)); // ✅ show top 5
};

  // ✅ Fetch Firebase users
  const fetchFirebaseUsers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/firebase/users`);
      if (res.data.success) {
        const { totalUsers, dailyData } = res.data;
        setStats((prev) => ({ ...prev, totalUsers }));
        setUserGraphData(dailyData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Firebase user stats");
    }
  };

  // ✅ Fetch top participants by votes
  const fetchTopParticipants = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/votes/all`);
      const allVotes = res.data || [];

      // Count votes per participant
      const voteCountMap = {};
      allVotes.forEach((v) => {
        if (v.participantName) {
          voteCountMap[v.participantName] =
            (voteCountMap[v.participantName] || 0) + 1;
        }
      });

      // Convert to sorted array (top 5)
      const top5 = Object.entries(voteCountMap)
        .map(([name, votes]) => ({ name, votes }))
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 5);

      setTopParticipants(top5);
    } catch (err) {
      console.error("Failed to fetch top participants:", err);
      toast.error("Failed to fetch top voted participants");
    }
  };

  // ✅ Initialize all fetch + socket updates
  useEffect(() => {
  fetchStats();
  fetchFirebaseUsers();

  const socket = io(BACKEND_URI, { transports: ["websocket"] });
  socket.on("dashboardUpdate", fetchStats);
  return () => socket.disconnect();
}, []);
  if (!stats)
    return (
      <div className="flex justify-center items-center min-h-screen text-purple-400 text-xl animate-pulse">
        Loading Dashboard Summary...
      </div>
    );

  // 📊 Pie chart data (Earnings)
  const earningsData = [
    { name: "Event Earnings", value: stats.eventEarnings },
    { name: "Stall Earnings", value: stats.stallEarnings },
  ];

  // 📊 Orders bar chart data
  const orderData = [
    { name: "Event Orders", count: stats.eventOrders },
    { name: "Stall Orders", count: stats.stallOrders },
  ];

  return (
    <div className="min-h-screen  text-white py-10 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Admin Dashboard Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <SummaryCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-purple-400 w-10 h-10" />}
          color="from-purple-600 to-pink-500"
        />
        <SummaryCard
          title="Participants"
          value={stats.totalParticipants}
          icon={<Star className="text-pink-400 w-10 h-10" />}
          color="from-pink-600 to-yellow-500"
        />
        <SummaryCard
          title="Total Votes"
          value={stats.totalVotes}
          icon={<Star className="text-yellow-400 w-10 h-10" />}
          color="from-yellow-600 to-orange-500"
        />
        <SummaryCard
          title="Event Orders"
          value={stats.eventOrders}
          icon={<Ticket className="text-green-400 w-10 h-10" />}
          color="from-green-600 to-emerald-400"
        />
        <SummaryCard
          title="Event Earnings (₹)"
          value={stats.eventEarnings?.toLocaleString()}
          icon={<Coins className="text-green-400 w-10 h-10" />}
          color="from-emerald-500 to-green-400"
        />
        <SummaryCard
          title="Stall Orders"
          value={stats.stallOrders}
          icon={<Store className="text-blue-400 w-10 h-10" />}
          color="from-blue-600 to-cyan-400"
        />
        <SummaryCard
          title="Stall Earnings (₹)"
          value={stats.stallEarnings?.toLocaleString()}
          icon={<Coins className="text-cyan-400 w-10 h-10" />}
          color="from-cyan-500 to-blue-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-1 gap-10 mt-16 max-w-7xl mx-auto">
        {/* Earnings Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-300">
             Earnings Distribution
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={earningsData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) => `${name}: ₹${value?.toLocaleString()}`}
              >
                {earningsData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v?.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-pink-300">
             Orders Comparison
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={orderData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ Top Participants by Votes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl mt-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-yellow-300">
           Top Participants by Votes
        </h2>
        {topParticipants.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topParticipants}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#ec4899" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center italic py-6">
            No participant votes available yet.
          </p>
        )}
      </div>

      {/* User Growth Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl mt-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-green-300">
           User Signups (Daily)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={userGraphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 🔹 Reusable Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => (
  <div
    className={`bg-gradient-to-r ${color} p-[1px] rounded-2xl shadow-lg hover:scale-[1.03] transition`}
  >
    <div className="bg-gray-900 p-6 rounded-2xl h-full flex flex-col justify-between">
      <div className="flex items-center gap-3">{icon}</div>
      <div className="mt-3">
        <h3 className="text-gray-400 text-lg">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;
