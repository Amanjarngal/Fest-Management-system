import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Ticket, Calendar, MapPin, Loader2 } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserUid(currentUser.uid);
        fetchUserTickets(currentUser.uid);
      } else {
        setUserUid(null);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Fetch Tickets API
  const fetchUserTickets = async (uid) => {
    try {
      const res = await axios.get(
        `${BACKEND_URI}/api/razorpay/events/user-orders/${uid}`
      );

      setTickets(res.data.orders || []);
    } catch (err) {
      console.error("❌ Error fetching user tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-white">
        <Loader2 className="animate-spin mr-2" /> Loading your tickets...
      </div>
    );

  if (!userUid)
    return (
      <div className="text-center text-gray-400 py-10">
        Please log in to view your tickets.
      </div>
    );

  // No tickets
  if (tickets.length === 0)
    return (
      <div className="text-gray-400 text-lg text-center py-10">
        🎟️ You haven’t purchased any tickets yet.
      </div>
    );

  // Main UI
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-pink-400 flex items-center gap-2">
        <Ticket size={28} /> My Event Tickets
      </h2>

      {tickets.map((order, idx) => (
        <div
          key={idx}
          className="bg-gray-800 p-5 rounded-xl mb-6 border border-gray-700 flex flex-col md:flex-row justify-between items-start"
        >
          {/* LEFT — Event & Ticket Info */}
          <div className="space-y-3 w-full">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 p-4 rounded-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <Ticket size={16} /> {item.eventId?.title}
                </h3>

                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {item.eventId?.date}
                </p>

                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <MapPin size={14} /> {item.eventId?.location}
                </p>

                <div className="text-gray-300 text-sm mt-3">
                  <p>
                    🎫 Ticket Type:{" "}
                    <span className="text-white font-semibold">
                      {item.pricingId?.ticketType}
                    </span>
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Price: ₹
                    {item.pricingId?.finalPrice || item.pricingId?.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Ticket Order ID */}
          <div className="mt-5 md:mt-0 md:ml-5 text-right">
            <p className="text-gray-400 text-sm mb-1">Your Ticket Code</p>
            <p className="text-3xl font-extrabold text-pink-400 tracking-wide">
              {order.ticketOrderId}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📸 Please keep a screenshot of this Ticket ID for entry.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTickets;
