import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Calendar, ArrowUpDown } from "lucide-react";
import UserAnalyticsChart from "../../components/DashboardChart/UserAnalyticsChart";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  // Fetch users from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/all")
      .then((res) => {
        const sorted = res.data.users.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsers(sorted);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Handle search filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle sorting toggle
  const toggleSort = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredUsers].sort((a, b) =>
      order === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    setUsers(sorted);
    setSortOrder(order);
  };

  // Role color badges
  const getRoleBadge = (role) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    switch (role) {
      case "admin":
        return <span className={`${base} bg-red-500/90 text-white`}>Admin</span>;
      case "organizer":
        return <span className={`${base} bg-blue-500/90 text-white`}>Organizer</span>;
      case "participant":
        return <span className={`${base} bg-green-500/90 text-white`}>Participant</span>;
      case "attendee":
        return <span className={`${base} bg-yellow-400 text-black`}>Attendee</span>;
      default:
        return <span className={`${base} bg-gray-600 text-white`}>User</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            👥 All Users
          </h1></div>
 {/* ✅ Chart Component */}
        <UserAnalyticsChart users={users} />

        {/* Search & Filters Section */}
<div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
  {/* Search Bar */}
  <div className="relative w-full md:w-80">
    <input
      type="text"
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md transition-all duration-300"
    />
    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>

  {/* Optional: Sorting or other filters */}
  <div className="flex items-center gap-3">
    <span className="text-gray-400 text-sm">Sort by:</span>
    <button
      onClick={toggleSort}
      className="flex items-center gap-1 bg-gray-800 hover:bg-purple-700/60 transition-colors text-white px-4 py-2 rounded-full text-sm shadow-md"
    >
      <Calendar size={16} />
      {sortOrder === "asc" ? "Oldest" : "Newest"}
      <ArrowUpDown size={14} />
    </button>
  </div>
</div>

        

         

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/80 backdrop-blur-md shadow-lg">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-purple-700/70 to-gray-800 text-gray-200 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th
                  className="px-6 py-4 flex items-center gap-2 cursor-pointer select-none"
                  // onClick={toggleSort}
                >
                  <Calendar size={16} /> Joined
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-800 hover:bg-gray-900/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No users found.
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

export default UsersPage;
