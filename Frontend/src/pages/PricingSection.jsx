import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, Star, Diamond, Medal, Percent } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const PricingSection = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🎟️ Fetch all events on load
  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // 💰 Fetch pricing tiers for selected event
  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    axios
      .get(`${BACKEND_URI}/api/pricing/event/${selectedEvent}`)
      .then((res) => {
        setTiers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pricing:", err);
        setLoading(false);
      });
  }, [selectedEvent]);

  // Icons and gradient color based on ticket type
  const tierIcons = {
    GOLDEN: <Diamond size={28} className="text-yellow-300" />,
    SILVER: <Star size={28} className="text-gray-300" />,
    BRONZE: <Medal size={28} className="text-orange-300" />,
  };

  const tierColors = {
    GOLDEN: "from-yellow-400 via-yellow-500 to-amber-600",
    SILVER: "from-gray-400 via-gray-500 to-gray-600",
    BRONZE: "from-orange-500 via-orange-600 to-red-600",
  };

  return (
    <section className="bg-gray-950 text-white py-20 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-yellow-400 mb-3">
          🎫 Event Ticket Pricing
        </h2>
        <p className="text-gray-400 text-lg">
          Select an event to explore available ticket tiers and offers.
        </p>
      </div>

      {/* Event Selector */}
      <div className="flex justify-center mb-12">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 w-full md:w-1/3 text-center"
        >
          <option value="">-- Choose an Event --</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title} ({e.date})
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Cards */}
      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading tiers...</p>
      ) : tiers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No pricing available for this event yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${
                tierColors[tier.ticketType] || "from-gray-700 to-gray-900"
              } shadow-xl p-[2px] transition-transform hover:scale-105`}
            >
              <div className="bg-gray-900 rounded-2xl p-8 h-full flex flex-col justify-between border border-gray-800">
                {/* Ticket Top Shape */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-full shadow-md" />

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    {tierIcons[tier.ticketType]}
                  </div>
                  <h3 className="text-2xl font-semibold">
                    {tier.ticketType} Ticket
                  </h3>

                  {/* Price Section */}
                  <div className="mt-2">
                    {tier.offer?.active ? (
                      <>
                        <p className="text-3xl font-extrabold text-green-400">
                          ₹{tier.finalPrice}
                          <span className="text-gray-400 text-sm font-medium">
                            {" "}
                            /pass
                          </span>
                        </p>
                        <p className="text-sm text-yellow-400 flex items-center justify-center gap-1">
                          <Percent size={14} /> {tier.offer.percentage}% off till{" "}
                          {new Date(tier.offer.expiry).toLocaleDateString()}
                        </p>
                        <p className="line-through text-gray-500 text-sm">
                          ₹{tier.price}
                        </p>
                      </>
                    ) : (
                      <p className="text-4xl font-extrabold mt-2 text-yellow-400">
                        ₹{tier.price}
                        <span className="text-gray-400 text-base font-medium">
                          {" "}
                          /pass
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-yellow-400" /> Tickets
                    Available: {tier.totalTickets - tier.ticketsSold}
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-yellow-400" /> Event Access
                    Included
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-yellow-400" /> Valid for
                    one person
                  </li>
                </ul>

                {/* Button */}
                <button
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all mt-auto"
                  onClick={() =>
                    alert(`Proceed to purchase ${tier.ticketType} Ticket`)
                  }
                >
                  Purchase Now →
                </button>
              </div>

              {/* Ticket Cut Dots */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-950 rounded-full border border-gray-700" />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-950 rounded-full border border-gray-700" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PricingSection;
