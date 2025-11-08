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
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative border border-gray-700 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
          🎁 Apply Offer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Discount Percentage:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={offerPercentage}
              onChange={(e) => setOfferPercentage(e.target.value)}
              placeholder="e.g., 20"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Offer Expiry (in days):
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
              placeholder="e.g., 7"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition-all"
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

  // Fetch events
  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/events`)
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("❌ Failed to load events"));
  }, []);

  // Fetch pricing for selected event
  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
        .then((res) => setExistingPricings(res.data))
        .catch(() => toast.error("❌ Failed to fetch pricing"));
    }
  }, [selectedEvent]);

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
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
        offerExpiry: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      });
      toast.success(res.data?.message || "✅ Offer applied successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to apply offer");
    }
  };

  const handleEditSave = async (pricingId) => {
    try {
      const res = await axios.put(`${BACKEND_URI}/api/pricing/update/${pricingId}`, editData);
      toast.success(res.data?.message || "✅ Pricing updated successfully!");
      setEditMode(null);
      await refreshPricing();
    } catch {
      toast.error("❌ Error updating pricing");
    }
  };

  const handleRemoveOffer = async (pricingId) => {
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/pricing/offer/${pricingId}`);
      toast.success(res.data?.message || "🗑️ Offer removed successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to remove offer");
    }
  };

  const handleDeletePricing = async (pricingId) => {
    if (!confirm("Are you sure you want to delete this pricing tier?")) return;
    try {
      const res = await axios.delete(`${BACKEND_URI}/api/pricing/${pricingId}`);
      toast.success(res.data?.message || "🗑️ Pricing deleted successfully!");
      await refreshPricing();
    } catch {
      toast.error("❌ Failed to delete pricing");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-8 md:px-16 py-8 space-y-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-yellow-400">
        🎟️ Manage Ticket Pricing
      </h1>

      {/* Event Selector */}
      <div className="mb-8">
        <label className="block mb-2 text-gray-400 text-sm sm:text-base">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full sm:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500"
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
        className="space-y-6 bg-gray-900 p-5 sm:p-6 md:p-8 rounded-xl shadow-xl border border-gray-800"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-400">
          Add / Update Tier Pricing
        </h2>
        {tiers.map((tier, i) => (
          <div key={tier.ticketType} className="grid sm:grid-cols-3 gap-4 sm:gap-6 items-center">
            <div className="flex items-center gap-3">
              <Tag className="text-yellow-400" />
              <span className="font-medium">{tier.ticketType}</span>
            </div>
            <input
              type="number"
              placeholder="Ticket Price"
              value={tier.price}
              onChange={(e) => handleTierChange(i, "price", e.target.value)}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
            <input
              type="number"
              placeholder="Total Tickets"
              value={tier.totalTickets}
              onChange={(e) => handleTierChange(i, "totalTickets", e.target.value)}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full sm:w-auto bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all"
        >
          Save Pricing
        </button>
      </form>

      {/* Existing Pricings */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-400">
          Current Pricing Tiers
        </h2>
        {existingPricings.length === 0 ? (
          <p className="text-gray-500">No pricing tiers added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingPricings.map((p) => (
              <div
                key={p._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl hover:shadow-yellow-500/20 transition-all"
              >
                <h3 className="text-lg font-bold mb-2 text-yellow-400">{p.ticketType}</h3>
                {editMode === p._id ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      placeholder="New Price"
                      className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                    <input
                      type="number"
                      value={editData.totalTickets}
                      onChange={(e) => setEditData({ ...editData, totalTickets: e.target.value })}
                      placeholder="New Total Tickets"
                      className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                    <button
                      onClick={() => handleEditSave(p._id)}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg w-full"
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
                          setEditData({ price: p.price, totalTickets: p.totalTickets });
                        }}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <Edit size={16} /> Edit
                      </button>

                      {/* Show "Remove Offer" button only if offer is active */}
                      {p.offer?.active && (
                        <button
                          onClick={() => handleRemoveOffer(p._id)}
                          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Trash2 size={16} /> Remove Offer
                        </button>
                      )}

                      {/* New Delete Pricing button */}
                      <button
                        onClick={() => handleDeletePricing(p._id)}
                        className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} /> Delete Pricing
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
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
