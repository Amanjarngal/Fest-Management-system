import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, Megaphone, User, KeyRound, ChevronDown, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAccountDropdown(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const navItemsLeft = [
    { name: "About", path: "/" },
    { name: "Events", hasDropdown: true },
    { name: "Gallery", path: "/gallery" },
    { name: "Voting Zone", path: "/voting" },
    {
      name: "Gate Pass",
      path: "/gatepass",
      icon: <KeyRound size={20} className="inline ml-2 text-purple-400" />,
    },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full" />
          <h1 className="text-3xl font-bold tracking-wide">FestoMania</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          <ul className="flex items-center space-x-8 font-semibold text-xl">
            {navItemsLeft.map((item, index) => (
              <li key={index} className="relative">
                <div
                  onMouseEnter={() => item.hasDropdown && setEventsDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setEventsDropdown(false)}
                >
                  <Link
                    to={item.path || "#"}
                    className="hover:text-purple-400 transition-colors duration-200 flex items-center"
                  >
                    {item.name}
                    {item.icon && item.icon}
                    {item.hasDropdown && <ChevronDown size={16} className="ml-1" />}
                  </Link>

                  {/* Dropdown for Events */}
                  {item.hasDropdown && eventsDropdown && (
                    <ul className="absolute top-full left-0 bg-black border border-gray-800 rounded shadow-lg w-48 z-50">
                      <li>
                        <Link
                          to="/events/competitions"
                          className="block px-4 py-2 hover:bg-purple-900 transition-colors duration-200"
                        >
                          Competitions
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/events/concerts"
                          className="block px-4 py-2 hover:bg-purple-900 transition-colors duration-200"
                        >
                          Concerts
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center space-x-6 pl-8 border-l border-gray-800">
            {/* Announcements Icon */}
            <Link
              to="/announcements"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              <Megaphone size={25} className="text-purple-400" />
            </Link>

            {/* Account Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAccountDropdown(true)}
              onMouseLeave={() => setAccountDropdown(false)}
            >
              <button className="hover:text-purple-400 transition-colors duration-200">
                <User size={25} className="text-purple-400" />
              </button>

              {accountDropdown && (
                <ul className="absolute right  bg-black border border-gray-800 rounded-lg shadow-lg w-44 text-base">
                  {user ? (
                    <>
                      <li>
                        <Link
                          to="/account"
                          className="block px-4 py-2 hover:bg-purple-900"
                        >
                          My Account
                        </Link>
                      </li>
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

            {/* Buy Ticket Button */}
            <Link
              to="/tickets"
              className="btn-gradient px-7 py-3 text-base flex items-center space-x-2"
            >
              <span>Buy Ticket</span>
              <ArrowRight size={20} />
            </Link>
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
    </nav>
  );
};

export default Navbar;
