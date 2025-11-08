import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, QrCode, Loader2, Camera, X } from "lucide-react";
import toast from "react-hot-toast";
import { QrReader } from "react-qr-reader"; // ✅ new library

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

  // ✅ Handle scanned QR data safely
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
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <Loader2 className="animate-spin text-yellow-400 w-10 h-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-yellow-400">🏪 All Stalls</h1>
        <button
          onClick={() => setScannerOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <Camera size={18} /> Scan Stall QR
        </button>
      </div>

      {/* ✅ Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 p-4">
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-lg relative">
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-yellow-400 mb-3 text-center">
              📷 Scan a Stall QR Code
            </h2>

            <div className="rounded-xl overflow-hidden border border-gray-700 w-[300px] h-[300px]">
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (!!result) handleScan(result?.text);
                  if (!!error) console.warn(error);
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              Point your camera at a stall QR to view its details.
            </p>
          </div>
        </div>
      )}

      {/* ✅ Stall Grid */}
      {stalls.length === 0 ? (
        <p className="text-center text-gray-400">No stalls available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stalls.map((stall) => (
            <Link
              key={stall._id}
              to={`/stall/${stall._id}`}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-md hover:shadow-yellow-500/20 hover:-translate-y-1 transition-all block"
            >
              {stall.qrCodeDataUrl && (
                <img
                  src={stall.qrCodeDataUrl}
                  alt="Stall QR"
                  className="w-32 h-32 mx-auto mb-4 rounded-lg border border-gray-700"
                />
              )}
              <h2 className="text-xl font-semibold text-yellow-400 text-center mb-2">
                {stall.name}
              </h2>
              <p className="text-gray-400 text-center text-sm mb-2">
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
