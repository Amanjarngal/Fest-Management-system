import React, { useEffect, useState } from "react";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const ConcertPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // ✅ Fetch performers from backend
  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URI}/api/performers`);
        setPerformers(res.data.performers || []);
      } catch (err) {
        console.error("Error fetching performers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformers();
  }, []);

  if (loading) {
    return (
      <section className="bg-black text-white py-24 text-center">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading Performers...
        </p>
      </section>
    );
  }

  // Show first 3 initially, reveal all on click
  const visiblePerformers = showAll ? performers : performers.slice(0, 3);

  return (
    <section className="relative bg-black py-16 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto text-center px-6">
        {/* Section Header */}
        <p className="text-pink-400 text-sm font-semibold mb-2 tracking-widest">
          // Our Line-Up //
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-14">
          Feature for your <span className="text-pink-500">Concert</span>
        </h2>

        {/* Performer Cards with Animation */}
        <div className="grid md:grid-cols-3 gap-10 justify-center items-center">
          {performers.length === 0 ? (
            <p className="text-gray-400 text-lg col-span-3">
              No performers available yet 🎤
            </p>
          ) : (
            <AnimatePresence>
              {visiblePerformers.map((performer, index) => (
                <motion.div
                  key={performer._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                  }}
                  className="group relative flex flex-col items-center"
                >
                  {/* Diamond Image Container */}
                  <div className="relative w-56 h-56 transform rotate-45 overflow-hidden border-4 border-transparent group-hover:border-pink-500 transition-all duration-500 shadow-[0_0_30px_rgba(255,20,147,0.3)]">
                    <img
                      src={performer.image}
                      alt={performer.name}
                      className="absolute inset-0 w-full h-full object-cover object-top -rotate-45 scale-110 group-hover:scale-125 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full transform -rotate-45 shadow-lg hover:scale-110 transition-all">
                      
                    </div>
                  </div>

                  {/* Performer Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mt-6 bg-[#1a1233]/70 px-6 py-3 rounded-lg backdrop-blur-sm"
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      {performer.role} • {performer.day}
                    </p>
                    <h3 className="text-xl font-bold">{performer.name}</h3>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* View All Button */}
        {!showAll && performers.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 bg-pink-500 hover:bg-pink-600 transition rounded-full font-semibold shadow-lg text-white tracking-wide"
            >
              View All Performers
            </button>
          </motion.div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
    </section>
  );
};

export default ConcertPerformers;
