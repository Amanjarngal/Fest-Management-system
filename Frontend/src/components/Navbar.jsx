import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  Megaphone,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { auth } from "../firebase";
import { getIdTokenResult,onAuthStateChanged, onIdTokenChanged, signOut } from "firebase/auth";
import { io } from "socket.io-client";
import AnnouncementModal from "../pages/AnnouncementModal";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // ✅ Socket listener for announcements
  useEffect(() => {
    const socket = io(BACKEND_URI, { transports: ["websocket"] });
    socket.on("newAnnouncement", () => {
      setNewCount((prev) => prev + 1);
    });
    return () => socket.disconnect();
  }, []);

  // ✅ Save and clear token on change
  useEffect(() => {
    const unsubscribeToken = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem("authToken", token);
        setUser(currentUser);
      } else {
        // Token expired or user logged out
        localStorage.removeItem("authToken");
        setUser(null);
        
      }
    });

    return () => unsubscribeToken();
  }, [navigate]);

  useEffect(() => {
  const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
    if (currentUser) {
      const tokenResult = await getIdTokenResult(currentUser);
      const userRole = tokenResult.claims.role || "user";
      setUser(currentUser);
      setRole(userRole);
      localStorage.setItem("userRole", userRole);
    } else {
      setUser(null);
      setRole(null);
      localStorage.removeItem("userRole");
      // navigate("/login");
    }
  });

  return () => unsubscribe();
}, [navigate]);
  // ✅ Manual logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setAccountDropdown(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const navItemsLeft = [
    { name: "About", path: "/about" },
    { name: "Events", path: "/eventSchedules" },
    { name: "Gallery", path: "/gallery" },
    { name: "Voting Zone", path: "/voting" },
    { name: "Stalls", path: "/stalls" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <nav className="bg-black text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full" />
            <h1 className="text-3xl font-bold tracking-wide">FestoMania</h1>
          </Link>

          {/* ✅ Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <ul className="flex items-center space-x-8 font-semibold text-xl">
              {navItemsLeft.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="hover:text-purple-400 transition-colors duration-200 flex items-center"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side */}
            <div className="flex items-center space-x-6 pl-8 border-l border-gray-800">
              {/* Announcements */}
              <button
                onClick={() => {
                  setModalOpen(true);
                  setNewCount(0);
                }}
                className="relative hover:text-yellow-400 transition-all"
              >
                <Megaphone size={25} className="text-purple-400" />
                {newCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    {newCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="hover:text-purple-400 transition-colors duration-200"
              >
                <ShoppingCart size={25} className="text-purple-400" />
              </button>

              {/* Account */}
              <div
                className="relative"
                onMouseEnter={() => setAccountDropdown(true)}
                onMouseLeave={() => setAccountDropdown(false)}
              >
                <button className="hover:text-purple-400 transition-colors duration-200">
                  <User size={25} className="text-purple-400" />
                </button>

      {accountDropdown && (
  <ul className="absolute right-0 bg-black border border-gray-800 rounded-lg shadow-lg w-44 text-base">
    {user ? (
      <>
        {/* ✅ ADMIN DASHBOARD */}
        {role === "admin" && (
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-purple-900"
            >
              Dashboard
            </Link>
          </li>
        )}

        {/* ✅ STALL OWNER DASHBOARD */}
        {role === "stallOwner"  && (
          <li>
            <Link
              to="/stall-dashboard"
              className="block px-4 py-2 hover:bg-purple-900"
            >
              Stall Dashboard
            </Link>
          </li>
        )}

        {/* My Account */}
        <li>
          <Link
            to="/account"
            className="block px-4 py-2 hover:bg-purple-900"
          >
            My Account
          </Link>
        </li>

        {/* Logout */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-purple-900 flex items-center"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </li>
      </>
    ) : (
      <li>
        <Link
          to="/login"
          className="block px-4 py-2 hover:bg-purple-900"
        >
          Login
        </Link>
      </li>
    )}
  </ul>
)}


              </div>

              {/* Buy Ticket */}
              <button
                onClick={() => navigate("/eventSchedules")}
                className="btn-gradient px-7 py-3 text-base flex items-center space-x-2"
              >
                <span>Buy Ticket</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-black border-t border-gray-800">
            <ul className="flex flex-col text-lg font-semibold px-6 py-4 space-y-3">
              {navItemsLeft.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-purple-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <hr className="border-gray-800 my-2" />

              {/* Account Section (Mobile) */}
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-purple-400"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-left hover:text-purple-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-purple-400"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => {
                  navigate("/eventSchedules");
                  setMenuOpen(false);
                }}
                className="btn-gradient px-5 py-2 mt-3 text-center flex items-center justify-center space-x-2"
              >
                <span>Buy Ticket</span>
                <ArrowRight size={18} />
              </button>
            </ul>
          </div>
        )}
      </nav>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
