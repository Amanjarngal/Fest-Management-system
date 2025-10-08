import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, Megaphone, User, KeyRound, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false); // For desktop hover

  const navItemsLeft = [
    { name: "About", path: "/" },
    { name: "Events", hasDropdown: true },
    { name: "Gallery", path: "/gallery" },
    { name: "Voting Zone", path: "/voting" },
    { name: "Gate Pass", path: "/gatepass", icon: <KeyRound size={20} className="inline ml-2 text-purple-400" /> },
    { name: "Contact Us", path: "/contact" },
  ];

  const navItemsRight = [
    { path: "/announcements", icon: <Megaphone size={25} className="inline ml-2 text-purple-400" /> },
    { path: "/account", icon: <User size={25} className="inline ml-2 text-purple-400" /> },
  ];

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full" />
          <h1 className="text-3xl font-bold tracking-wide">EventFlow</h1>
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
      to={item.path || "#"} // If no path (like Events), use #
      className="hover:text-purple-400 transition-colors duration-200 flex items-center"
    >
      {item.name}
      {item.icon && item.icon}
      {item.hasDropdown && <ChevronDown size={16} className="ml-1" />}
    </Link>

    {/* Dropdown for Events */}
    {item.hasDropdown && eventsDropdown && (
      <ul className="absolute top-full left-0  bg-black border border-gray-800 rounded shadow-lg w-48 z-50">
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

          {/* Right side links */}
          <div className="flex items-center space-x-6 pl-8 border-l border-gray-800">
            {navItemsRight.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="hover:text-purple-400 transition-colors duration-200 flex items-center font-semibold text-base"
              >
                {item.name}
                {item.icon && item.icon}
              </Link>
            ))}

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

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <ul className="flex flex-col items-center space-y-5 py-6 font-medium text-lg">
            {navItemsLeft.map((item, index) => (
              <li key={index} className="w-full text-center">
                {item.hasDropdown ? (
                  <div className="w-full">
                    <button
                      onClick={() => setEventsDropdown(!eventsDropdown)}
                      className="flex justify-center items-center w-full hover:text-purple-400 transition-colors duration-200"
                    >
                      {item.name}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                    {eventsDropdown && (
                      <ul className="flex flex-col mt-2">
                        <li>
                          <Link
                            to="/events/competitions"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-purple-900 transition-colors duration-200"
                          >
                            Competitions
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/events/concerts"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-purple-900 transition-colors duration-200"
                          >
                            Concerts
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-purple-400 transition-colors duration-200 flex items-center justify-center"
                  >
                    {item.name}
                    {item.icon && item.icon}
                  </Link>
                )}
              </li>
            ))}

            {/* Right-side mobile icons */}
            <div className="flex justify-center items-center space-x-10 py-3">
              {navItemsRight.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-purple-400 transition-colors duration-200 flex items-center text-lg"
                >
                  {item.icon && item.icon}
                </Link>
              ))}
            </div>

            {/* Buy Ticket Button */}
            <Link
              to="/tickets"
              onClick={() => setMenuOpen(false)}
              className="btn-gradient text-white px-7 py-3 rounded-full font-semibold flex items-center space-x-2"
            >
              <span>Buy Ticket</span>
              <ArrowRight size={20} />
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
