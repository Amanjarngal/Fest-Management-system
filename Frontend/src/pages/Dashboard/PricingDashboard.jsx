import React, { useEffect, useState } from "react";
import axios from "axios";
import { Percent, Tag, Trash2, X, Edit } from "lucide-react";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

// ========================= Offer Modal =========================
const OfferModal = ({ isOpen, onClose, onSubmit }) => {
  const [offerPercentage, setOfferPercentage] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offerPercentage) return toast.error("⚠️ Please enter discount percentage");
    onSubmit(Number(offerPercentage), Number(expiryDays));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gray-950 rounded-2xl p-6 w-full max-w-md relative border border-gray-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-4">
          🎁 Apply Offer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Discount Percentage:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              placeholder="e.g., 20"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Offer Expiry (in days):</label>
            <input
              type="number"
              min="1"
              max="30"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              placeholder="e.g., 7"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-black font-semibold py-3 rounded-lg transition-all"
          >
            Apply Offer
          </button>
        </form>
      </div>
    </div>
  );
};

// ========================= Pricing Dashboard =========================
const PricingDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tiers, setTiers] = useState([
    { ticketType: "GOLDEN", price: "", totalTickets: "" },
    { ticketType: "SILVER", price: "", totalTickets: "" },
    { ticketType: "BRONZE", price: "", totalTickets: "" },
  ]);
  const [existingPricings, setExistingPricings] = useState([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedPricingId, setSelectedPricingId] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ price: "", totalTickets: "" });

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/events`)
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("❌ Failed to load events"));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
        .then((res) => setExistingPricings(res.data))
        .catch(() => toast.error("❌ Failed to fetch pricing"));
    }
  }, [selectedEvent]);

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const refreshPricing = async () => {
    const refreshed = await axios.get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`);
    setExistingPricings(refreshed.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return toast.error("⚠️ Please select an event first");
    try {
      const res = await axios.post(`${BACKEND_URI}/api/pricing/create`, {
        eventId: selectedEvent,
        tiers,
      });
      toast.success(res.data?.message || "🎟️ Pricing created successfully!");
      setTiers([
        { ticketType: "GOLDEN", price: "", totalTickets: "" },
        { ticketType: "SILVER", price: "", totalTickets: "" },
        { ticketType: "BRONZE", price: "", totalTickets: "" },
      ]);
      await refreshPricing();
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Error creating pricing");
    }
  };

  const handleApplyOffer = async (percentage, days) => {
    if (!selectedPricingId) return;
    try {
      const res = await axios.put(`${BACKEND_URI}/api/pricing/offer/${selectedPricingId}`, {
        offerPercentage: percentage,
        offerExpiry: new Date(Date.now() + days * 86400000),
      });
      toast.success(res.data?.message || "✅ Offer applied successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to apply offer");
    }
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`${BACKEND_URI}/api/pricing/update/${id}`, editData);
      toast.success(res.data?.message || "✅ Pricing updated successfully!");
      setEditMode(null);
      await refreshPricing();
    } catch {
      toast.error("❌ Error updating pricing");
    }
  };

  const handleRemoveOffer = async (id) => {
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/pricing/offer/${id}`);
      toast.success(res.data?.message || "🗑️ Offer removed successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to remove offer");
    }
  };

  const handleDeletePricing = async (id) => {
    if (!confirm("Are you sure you want to delete this pricing tier?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/pricing/${id}`);
      toast.success(res.data?.message || "🗑️ Pricing deleted successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to delete pricing");
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 ">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
             Manage Ticket Pricing
          </h1>
        </div>

        {/* Event Selector */}
        <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-6 shadow-md backdrop-blur-md">
          <label className="block mb-2 text-gray-400 text-sm font-medium">
            Select Event:
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full sm:w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">-- Choose an event --</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title} ({e.date})
              </option>
            ))}
          </select>
        </div>

        {/* Add Pricing Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-950/80 border border-gray-800 rounded-xl p-8 shadow-lg backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparentbg-clip-text text-transparent">
            Add / Update Tier Pricing
          </h2>
          {tiers.map((tier, i) => (
            <div
              key={tier.ticketType}
              className="grid sm:grid-cols-3 gap-4 items-center"
            >
              <div className="flex items-center gap-3">
                <Tag className="text-yellow-400" />
                <span className="font-medium">{tier.ticketType}</span>
              </div>
              <input
                type="number"
                placeholder="Ticket Price"
                value={tier.price}
                onChange={(e) => handleTierChange(i, "price", e.target.value)}
                className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 transition"
              />
              <input
                type="number"
                placeholder="Total Tickets"
                value={tier.totalTickets}
                onChange={(e) => handleTierChange(i, "totalTickets", e.target.value)}
                className="p-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700  text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-all"
          >
            Save Pricing
          </button>
        </form>

        {/* Existing Pricings */}
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Current Pricing Tiers
          </h2>
          {existingPricings.length === 0 ? (
            <p className="text-gray-500">No pricing tiers added yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingPricings.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <h3 className="text-lg font-bold mb-2 text-yellow-400">{p.ticketType}</h3>
                  {editMode === p._id ? (
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: e.target.value })
                        }
                        placeholder="New Price"
                        className="w-full p-2 rounded bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        value={editData.totalTickets}
                        onChange={(e) =>
                          setEditData({ ...editData, totalTickets: e.target.value })
                        }
                        placeholder="New Total Tickets"
                        className="w-full p-2 rounded bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => handleEditSave(p._id)}
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg w-full transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>💰 Price: ₹{p.finalPrice}</p>
                      <p>🎫 Available: {p.totalTickets - p.ticketsSold}</p>
                      {p.offer?.active && (
                        <p className="text-green-400 mt-2 text-sm">
                          🔥 {p.offer.percentage}% off until{" "}
                          {new Date(p.offer.expiry).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => {
                            setSelectedPricingId(p._id);
                            setShowOfferModal(true);
                          }}
                          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Percent size={16} /> Offer
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(p._id);
                            setEditData({
                              price: p.price,
                              totalTickets: p.totalTickets,
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        {p.offer?.active && (
                          <button
                            onClick={() => handleRemoveOffer(p._id)}
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Trash2 size={16} /> Remove Offer
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePricing(p._id)}
                          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleApplyOffer}
      />
    </div>
  );
};

export default PricingDashboard;
