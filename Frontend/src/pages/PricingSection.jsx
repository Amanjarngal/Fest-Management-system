import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Diamond,
  Medal,
  Ticket,
  Percent,
  Check,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const PricingSection = () => {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // 🧩 Fetch Event + Pricing
  useEffect(() => {
    if (!eventId) return;
    const fetchEventData = async () => {
      try {
        const [eventRes, pricingRes] = await Promise.all([
          axios.get(`${BACKEND_URI}/api/events/${eventId}`),
          axios.get(`${BACKEND_URI}/api/pricing/event/${eventId}`),
        ]);
        setEventDetails(eventRes.data);
        setTiers(pricingRes.data);
      } catch (error) {
        console.error("Error fetching event pricing:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  // 🛒 Add to Cart Handler
  const handlePurchase = async (tier) => {
    try {
      if (!user) {
        toast.error("Please log in to continue!");
        navigate("/login");
        return;
      }

      const uid = user.uid;
      const token = await user.getIdToken();

      const cartItem = {
        uid,
        eventId,
        pricingId: tier._id,
        quantity: 1,
      };

      const res = await axios.post(`${BACKEND_URI}/api/cart/add`, cartItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(`${tier.ticketType} Ticket added to cart successfully!`);
        setTimeout(() => navigate("/cart"), 1200);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add ticket to cart. Please try again.");
    }
  };

  // 🎨 Tier Icons & Colors
  const tierIcons = {
    GOLDEN: <Diamond size={30} className="text-yellow-300 drop-shadow-glow" />,
    SILVER: <Star size={30} className="text-gray-300" />,
    BRONZE: <Medal size={30} className="text-orange-400" />,
  };

  const tierColors = {
    GOLDEN: "from-yellow-400 via-yellow-500 to-amber-600",
    SILVER: "from-gray-400 via-gray-500 to-gray-600",
    BRONZE: "from-orange-500 via-orange-600 to-red-600",
  };

  const tierBenefits = {
    GOLDEN: [
      "Access to all main stage events",
      "VIP lounge + backstage entry",
      "Free premium refreshments & meals",
      "Front-row seating for shows",
      "Exclusive meet & greet with performers",
      "Priority entry line + early access",
      "Complimentary fest merchandise kit",
    ],
    SILVER: [
      "Access to all main stage events",
      "Free refreshments",
      "Preferred seating zone",
      "Discount on merchandise purchases",
    ],
    BRONZE: [
      "Access to general fest area",
      "Free entry to selected events",
      "Basic refreshments available for purchase",
    ],
  };

  return (
    <section className="bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white py-20 px-6 min-h-screen">
    

      {loading ? (
        <p className="text-center text-gray-400 text-lg animate-pulse">
          Loading event details...
        </p>
      ) : (
        <>
          {/* 🎟️ Event Header */}
          <div
            className="max-w-4xl mx-auto text-center mb-14"
            data-aos="fade-up"
          >
            <h2 className="text-5xl font-extrabold mb-3">
              Ticket Pricing for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {eventDetails?.title}
              </span>
            </h2>
            <div className="flex justify-center flex-wrap gap-5 mt-6 text-gray-300">
              <p className="flex items-center gap-2">
                <Calendar size={18} className="text-pink-400" />{" "}
                {eventDetails?.date}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" />{" "}
                {eventDetails?.location}
              </p>
              {eventDetails?.time && (
                <p className="flex items-center gap-2">
                  <Clock size={18} className="text-green-400" />{" "}
                  {eventDetails?.time}
                </p>
              )}
            </div>
            {eventDetails?.description && (
              <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-relaxed">
                {eventDetails.description}
              </p>
            )}
          </div>

          {/* 🪙 Pricing Tiers */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <div
                key={tier._id}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className={`rounded-2xl bg-gradient-to-b ${tierColors[tier.ticketType]} p-[2px] shadow-lg hover:scale-105 transition-transform duration-300`}
              >
                <div className="bg-gray-950 rounded-2xl p-8 flex flex-col justify-between h-full border border-gray-800">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center mb-2">
                      {tierIcons[tier.ticketType]}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-wide uppercase">
                      {tier.ticketType} Pass
                    </h3>

                    {tier.offer?.active ? (
                      <>
                        <p className="text-3xl font-bold text-green-400">
                          ₹{tier.finalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-yellow-400 flex justify-center items-center gap-1">
                          <Percent size={14} /> {tier.offer.percentage}% off till{" "}
                          {new Date(tier.offer.expiry).toLocaleDateString()}
                        </p>
                        <p className="line-through text-gray-500 text-sm">
                          ₹{tier.price.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-4xl font-extrabold mt-2 text-pink-400">
                        ₹{tier.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <ul className="mt-5 text-sm text-gray-400 space-y-2">
                    {tierBenefits[tier.ticketType].map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-pink-400" /> {benefit}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(tier)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-full mt-8 hover:scale-105 transition-all shadow-lg"
                  >
                    <Ticket className="inline-block mr-2" size={18} /> Purchase
                    Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PricingSection;
