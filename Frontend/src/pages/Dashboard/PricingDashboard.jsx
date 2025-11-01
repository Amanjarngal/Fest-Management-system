import React, { useEffect, useState } from "react";
import axios from "axios";
import { Percent, Tag, Trash2, X } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

// 🎁 Offer Modal Component
const OfferModal = ({ isOpen, onClose, onSubmit }) => {
  const [offerPercentage, setOfferPercentage] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offerPercentage) return alert("Please enter discount percentage");
    onSubmit(Number(offerPercentage), Number(expiryDays));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
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

const PricingDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tiers, setTiers] = useState([
    { ticketType: "GOLDEN", price: "", totalTickets: "" },
    { ticketType: "SILVER", price: "", totalTickets: "" },
    { ticketType: "BRONZE", price: "", totalTickets: "" },
  ]);
  const [existingPricings, setExistingPricings] = useState([]);

  // Offer modal control
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedPricingId, setSelectedPricingId] = useState(null);

  // ✅ Fetch events
  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch pricing for selected event
  useEffect(() => {
    if (selectedEvent) {
      axios
        .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
        .then((res) => setExistingPricings(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedEvent]);

  // ✅ Handle input change for tiers
  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
  };

  // ✅ Submit new tier pricing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URI}/api/pricing/create`, {
        eventId: selectedEvent,
        tiers,
      });
      alert("🎟️ Pricing created successfully!");
      setTiers([
        { ticketType: "GOLDEN", price: "", totalTickets: "" },
        { ticketType: "SILVER", price: "", totalTickets: "" },
        { ticketType: "BRONZE", price: "", totalTickets: "" },
      ]);
      axios
        .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
        .then((res) => setExistingPricings(res.data));
    } catch (err) {
      alert(err.response?.data?.error || "Error creating pricing");
    }
  };

  // ✅ Apply offer logic
  const handleApplyOffer = async (percentage, days) => {
    if (!selectedPricingId) return;

    try {
      await axios.put(`${BACKEND_URI}/api/pricing/offer/${selectedPricingId}`, {
        offerPercentage: percentage,
        offerExpiry: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      });
      alert("✅ Offer applied!");
      axios
        .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
        .then((res) => setExistingPricings(res.data));
    } catch (err) {
      alert("Error applying offer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">🎟️ Manage Ticket Pricing</h1>

      {/* Event Selector */}
      <div className="mb-8">
        <label className="block mb-2 text-gray-400">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg"
        >
          <option value="">-- Choose an event --</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title} ({e.date})
            </option>
          ))}
        </select>
      </div>

      {/* Add Pricing */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add / Update Tier Pricing
        </h2>
        {tiers.map((tier, i) => (
          <div key={tier.ticketType} className="grid md:grid-cols-3 gap-6 items-center">
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
          className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all"
        >
          Save Pricing
        </button>
      </form>

      {/* Existing Pricings */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Current Pricing Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {existingPricings.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl hover:shadow-yellow-500/20 transition-all relative"
            >
              <h3 className="text-lg font-bold mb-2 text-yellow-400">
                {p.ticketType}
              </h3>
              <p>💰 Price: ₹{p.finalPrice}</p>
              <p>🎫 Available: {p.totalTickets - p.ticketsSold}</p>
              {p.offer?.active && (
                <p className="text-green-400 mt-2">
                  🔥 {p.offer.percentage}% off until{" "}
                  {new Date(p.offer.expiry).toLocaleDateString()}
                </p>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedPricingId(p._id);
                    setShowOfferModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Percent size={16} /> Apply Offer
                </button>
                <button
                  onClick={() =>
                    axios
                      .delete(`${BACKEND_URI}/api/pricing/offer/${p._id}`)
                      .then(() =>
                        axios
                          .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
                          .then((res) => setExistingPricings(res.data))
                      )
                  }
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={16} /> Remove Offer
                </button>
              </div>
            </div>
          ))}
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
