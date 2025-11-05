import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-300 pt-20 pb-10 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-600/20 blur-[160px] top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-600/20 blur-[200px] bottom-0 right-0 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid gap-12 md:grid-cols-4">
        {/* Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            <span className="text-pink-500">Fest</span>omina
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The most electrifying college fest experience! Join us for music, art, technology, and unforgettable memories under the stars 🌟.
          </p>

          {/* Social Media */}
          <div className="flex gap-4 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 text-white transition-all"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Events", "Tickets", "Gallery", "Contact Us"].map((link, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="hover:text-pink-400 transition-all duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {["FAQs", "Terms & Conditions", "Privacy Policy", "Refund Policy"].map((link, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="hover:text-pink-400 transition-all duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="text-pink-500" size={18} />
              festomina@gmail.com
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-pink-500" size={18} />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="text-pink-500" size={18} />
              Amritsar Group Of Colleges, Punjab
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="relative z-10 mt-16 border-t border-gray-800/60"></div>

      {/* Footer Bottom */}
      <div className="relative z-10 mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} <span className="text-pink-400 font-semibold">Festomina</span>.  
        All Rights Reserved | Made by Aman Jarngal
      </div>
    </footer>
  );
};

export default Footer;
