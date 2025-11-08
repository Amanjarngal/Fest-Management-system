import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Tag,
  QrCode,
  Loader2,
  UtensilsCrossed,
  ArrowLeft,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const StallDetails = () => {
  const { id } = useParams();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URI}/api/stalls/${id}`);
      setStall(res.data);
    } catch (err) {
      console.error("Error fetching stall:", err);
      toast.error("Failed to load stall details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStall();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <Loader2 className="animate-spin text-yellow-400 w-10 h-10" />
      </div>
    );

  if (!stall)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-400">
        Stall not found 😢
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/stalls"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6"
        >
          <ArrowLeft size={18} /> Back to Stalls
        </Link>

        {/* Stall Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {stall.qrCodeDataUrl && (
              <img
                src={stall.qrCodeDataUrl}
                alt="Stall QR"
                className="w-40 h-40 rounded-lg border border-gray-700 shadow-md hover:scale-105 transition-transform"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                {stall.name}
              </h1>
              <p className="text-gray-300 mb-3">{stall.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={15} /> {stall.location || "Unknown location"}
                </span>
                <span className="flex items-center gap-1">
                  <User size={15} /> {stall.ownerName || "Unknown Owner"}
                </span>
              </div>

              {/* Offer Section */}
              {stall.offer && stall.offer.active && (
                <div className="mt-4 bg-yellow-400/10 border border-yellow-500/40 text-yellow-300 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                  <Tag size={16} /> {stall.offer.percentage}% OFF until{" "}
                  {new Date(stall.offer.expiry).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6 flex items-center gap-2">
          <UtensilsCrossed size={22} /> Menu Items
        </h2>

        {stall.menu && stall.menu.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stall.menu.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 border border-gray-800 p-5 rounded-xl shadow-md hover:shadow-yellow-500/20 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-yellow-300">
                    {item.name}
                  </h3>
                  <p className="text-green-400 font-bold text-sm">₹{item.price}</p>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {item.description || "No description."}
                </p>

                {item.available === false && (
                  <span className="text-red-500 text-xs bg-red-900/40 px-2 py-1 rounded-md">
                    Currently Unavailable
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-8">
            No menu items available for this stall.
          </p>
        )}

        {/* Token/Cart Info */}
        <div className="mt-10 bg-gray-900 border border-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
            🎟️ Current Tokens
          </h3>
          <p className="text-gray-300">
            Current Token:{" "}
            <span className="text-yellow-400 font-bold">
              {stall.currentToken || 0}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total Tokens Generated: {stall.tokens?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StallDetails;
