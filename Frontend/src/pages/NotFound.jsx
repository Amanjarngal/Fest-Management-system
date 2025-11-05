import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white overflow-hidden text-center px-6">
      {/* Glowing background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-600/20 blur-[180px] top-10 left-10 animate-pulse" />
        <div className="absolute w-[32rem] h-[32rem] bg-purple-700/20 blur-[200px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* 404 Text */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[8rem] md:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-xl md:text-2xl font-semibold text-gray-300"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gray-500 mt-2 max-w-md"
      >
        It might have been moved, deleted, or perhaps you mistyped the link.
      </motion.p>

      {/* Back Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 rounded-full font-semibold text-black shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </motion.div>

      {/* Festomina Signature */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-10 text-sm text-gray-500"
      >
        © {new Date().getFullYear()} <span className="text-pink-400 font-semibold">Festomina</span> – All rights reserved.
      </motion.p>
    </section>
  );
};

export default NotFound;
