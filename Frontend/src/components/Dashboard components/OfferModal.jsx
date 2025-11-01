// src/components/OfferModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const OfferModal = ({ pricing, onClose, refreshTiers }) => {
  const [offerPercentage, setOfferPercentage] = useState("");
  const [offerExpiry, setOfferExpiry] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${BACKEND_URI}/api/pricing/offer/${pricing._id}`, {
      offerPercentage,
      offerExpiry,
    });
    refreshTiers();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Apply Offer to {pricing.ticketType} Ticket
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Offer Percentage (%)</label>
            <input
              type="number"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Offer Expiry Date</label>
            <input
              type="date"
              value={offerExpiry}
              onChange={(e) => setOfferExpiry(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Offer
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferModal;
