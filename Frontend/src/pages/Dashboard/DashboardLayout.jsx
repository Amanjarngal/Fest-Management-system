import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Users,
  LogOut,
  Image,
  Star,
  Ticket,
  Music2,
  MessageSquare,
  Megaphone,
  Store,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth"; // ✅ Import Firebase Auth
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ To redirect after logout
  const auth = getAuth(); // ✅ Firebase Auth instance

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/dashboard/users", icon: <Users size={20} /> },
    { name: "Make Admin", path: "/dashboard/make-admin", icon: <Users size={20} /> },
    { name: "Images", path: "/dashboard/images", icon: <Image size={20} /> },
    { name: "Participants", path: "/dashboard/participants", icon: <Users size={20} /> },
    { name: "Leaderboard", path: "/dashboard/leaderboard", icon: <Star size={20} /> },
    { name: "Events", path: "/dashboard/events", icon: <Ticket size={20} /> },
    { name: "Pricing", path: "/dashboard/pricingSet", icon: <Ticket size={20} /> },
    { name: "Performers", path: "/dashboard/performers", icon: <Music2 size={20} /> },
    { name: "Feedback", path: "/dashboard/feedback", icon: <MessageSquare size={20} /> },
    { name: "Announcement", path: "/dashboard/announcement", icon: <Megaphone size={20} /> },
    { name: "Stalls", path: "/dashboard/stalls", icon: <Store size={20} /> },
  ];

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      localStorage.removeItem("token"); // Remove token from localStorage
      toast.success("👋 Logged out successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("❌ Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex">

      {/* ✅ Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-50 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold tracking-wide">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            ✖
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile click
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 mx-3 rounded-lg mb-2 transition-colors duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-gray-400 hover:text-red-400 transition"
          >
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ✅ Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* ✅ Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:ml-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ✅ Floating Menu Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-purple-600 text-white p-3 rounded-full shadow-lg md:hidden hover:bg-purple-700 transition z-50"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

export default DashboardLayout;
