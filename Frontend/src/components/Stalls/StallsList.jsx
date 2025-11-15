import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Loader2, Camera, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import QrScanner from "react-qr-scanner";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const StallsList = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStalls = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URI}/api/stalls`);
      setStalls(res.data || []);
    } catch (err) {
      console.error("Error fetching stalls:", err);
      toast.error("Failed to load stalls.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  const handleScan = (data) => {
    if (!data) return;
    console.log("Scanned:", data);

    const match = data.match(/stall\/([a-f0-9]+)/i);
    if (match && match[1]) {
      const stallId = match[1];
      toast.success("✅ QR scanned successfully!");
      setScannerOpen(false);
      navigate(`/stall/${stallId}`);
    } else {
      toast.error("⚠️ Invalid QR Code format");
    }
  };

  const handleError = (err) => {
    console.error("QR Reader Error:", err);
    toast.error("Camera access denied or not available.");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0b0014] via-[#150021] to-[#0b0014] text-pink-400">
        <Loader2 className="animate-spin text-pink-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      {/* Glowing background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-600/20 blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <motion.h1
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-white bg-clip-text text-transparent "
  >
     All <span className="text-pink-500">Stalls</span>
  </motion.h1>
        <motion.button
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    onClick={() => setScannerOpen(true)}
    className="bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 px-5 py-3 rounded-lg flex items-center gap-2 text-white shadow-[0_0_15px_#f472b6aa] hover:shadow-[0_0_25px_#f472b6] transition-all duration-300"
  >
    <Camera size={18} /> Scan Stall QR
  </motion.button>
      </div>

      {/* ✅ Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 p-4 backdrop-blur-md">
          <div className="bg-[#0f0017] p-6 rounded-2xl border border-pink-500/40 shadow-[0_0_25px_#f472b6] relative w-full max-w-md">
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-pink-400 mb-4 text-center">
              📷 Scan a Stall QR Code
            </h2>

            {/* ✅ Fixed camera view */}
            <div className="rounded-xl overflow-hidden border-2 border-pink-500/60 w-[300px] h-[300px] mx-auto bg-black shadow-inner">
          <QrReader
  constraints={{
    facingMode: "environment", // "user" for front camera
  }}
  onResult={(result, error) => {
    if (!!result) {
      handleScan(result?.text); // contains scanned QR value
    }
    if (!!error) {
      console.warn(error);
    }
  }}
  videoStyle={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>

            </div>

            <p className="text-gray-400 text-sm mt-4 text-center">
              Point your camera at a stall QR to view its details.
            </p>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setScannerOpen(false)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-md hover:from-pink-500 hover:to-fuchsia-500 transition shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Stall Grid */}
      {stalls.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No stalls available yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stalls.map((stall) => (
            <Link
              key={stall._id}
              to={`/stall/${stall._id}`}
              className="bg-[#12001e] border border-pink-500/20 p-6 rounded-2xl shadow-[0_0_15px_#f472b633] hover:shadow-[0_0_25px_#f472b6aa] hover:-translate-y-1 transition-all duration-300 block"
            >
              {/* ✅ Stall Image */}
              {stall.imageUrl ? (
                <img
                  src={stall.imageUrl}
                  alt={stall.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-pink-500/30"
                />
              ) : (
                <div className="w-full h-48 bg-[#1a002b] flex items-center justify-center rounded-lg mb-4 border border-pink-500/30 text-pink-400">
                  <ImageIcon size={32} className="opacity-50" />
                </div>
              )}

              <h2 className="text-xl font-semibold text-pink-400 text-center mb-1">
                {stall.name}
              </h2>
              <p className="text-pink-300 text-center text-sm mb-2">
                {stall.category || "General"}
              </p>
              <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} /> {stall.location || "Location unknown"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StallsList;
