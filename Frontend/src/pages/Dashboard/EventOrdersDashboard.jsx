import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Ticket, Calendar, MapPin, CheckCircle } from "lucide-react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const EventOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const auth = getAuth();

  // ======================= FETCH ALL ORDERS =======================
  const fetchAllEventOrders = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) return toast.error("Please login as admin!");

      const res = await axios.get(`${BACKEND_URI}/api/razorpay/events/all-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
        setSummary({
          totalOrders: res.data.totalOrders,
          totalTickets: res.data.totalTickets,
          totalRevenue: res.data.totalRevenue,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching all event orders:", err);
      toast.error("Failed to fetch event orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEventOrders();
  }, []);

  // ======================= SEARCH FILTER =======================
  const filteredOrders = orders.filter((order) =>
    order.ticketOrderId?.toLowerCase().includes(search.toLowerCase())
  );

  // ======================= ALLOT TICKET =======================
  const allotTicket = async (orderId) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return toast.error("Unauthorized!");

      const res = await axios.put(
        `${BACKEND_URI}/api/razorpay/events/allot/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("🎉 Ticket Alloted Successfully!");

      // Update UI instantly
      setOrders(prev =>
  prev.map(order =>
    order.orderId === orderId || order._id === orderId
      ? { ...order, isAlloted: true }
      : order
  )
);

    } catch (error) {
      console.error("❌ Ticket allot error:", error);
      toast.error("Failed to allot ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎟️ All Event Orders & Ticket Summary
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            View and allot event tickets to attendees
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search by Ticket Order ID (e.g., TK-ABC123)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-pink-500 outline-none"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <SummaryCard title="Total Orders" value={summary.totalOrders} color="from-purple-600 to-pink-500" />
              <SummaryCard title="Tickets Sold" value={summary.totalTickets} color="from-pink-500 to-yellow-400" />
              <SummaryCard
                title="Total Revenue"
                value={`₹${summary.totalRevenue?.toLocaleString()}`}
                color="from-green-500 to-emerald-400"
              />
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <p className="text-gray-400 text-center mt-20 italic">
                No matching orders found.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-2xl bg-gray-900/60 backdrop-blur-md">
                <table className="min-w-full text-sm sm:text-base border-collapse">
                  <thead className="bg-gradient-to-r from-purple-700/70 to-pink-700/70 text-gray-200 uppercase text-xs">
                    <tr>
                      <th className="p-3 border border-gray-800">#</th>
                      <th className="p-3 border border-gray-800 text-center">Ticket Order ID</th>
                      <th className="p-3 border border-gray-800 text-left">User ID</th>
                      <th className="p-3 border border-gray-800 text-left">Event & Tickets</th>
                      <th className="p-3 border border-gray-800 text-center">Total Tickets</th>
                      <th className="p-3 border border-gray-800 text-center">Total Amount</th>

                      {/* ⭐ NEW COLUMN FOR ALLOTMENT */}
                      <th className="p-3 border border-gray-800 text-center">Allot</th>

                      <th className="p-3 border border-gray-800 text-center">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.orderId}
                        className={`hover:bg-purple-700/10 transition-all ${
                          index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-900/30"
                        }`}
                      >
                        <td className="p-3 text-gray-400 border border-gray-800 text-center">{index + 1}</td>

                        <td className="p-3 text-pink-400 font-semibold border border-gray-800 text-center">
                          {order.ticketOrderId}
                        </td>

                        <td className="p-3 text-gray-300 border border-gray-800 text-xs">
                          {order.userId ? `${order.userId.slice(0, 12)}...` : "Unknown"}
                        </td>

                        {/* Event & Ticket details */}
                        <td className="p-3 border border-gray-800">
                          {order.items.map((item, i) => (
                            <div
                              key={`${order.orderId}-${i}`}
                              className="mb-3 p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-purple-500 transition"
                            >
                              <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                                <Ticket size={16} /> {item.title}
                              </h3>
                              <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
                                <Calendar size={14} /> {item.date}{" "}
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} /> {item.location}
                                </span>
                              </p>
                              <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                                <span>🎫 {item.ticketName}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.subtotal}</span>
                              </div>
                            </div>
                          ))}
                        </td>

                        <td className="p-3 border border-gray-800 text-center text-pink-400 font-semibold">
                          {order.items.reduce((sum, i) => sum + (i.quantity || 1), 0)}
                        </td>

                        <td className="p-3 border border-gray-800 text-green-400 font-bold text-center">
                          ₹{order.amount}
                        </td>

                        {/* ================== ALLOT BUTTON ================== */}
                        <td className="p-3 border border-gray-800 text-center">
                          {order.isAlloted ? (
                            <span className="text-green-400 font-bold flex items-center justify-center gap-1">
                              <CheckCircle size={18} /> Alloted
                            </span>
                          ) : (
                            <button
                              onClick={() => allotTicket(order.orderId)}
                              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm transition"
                            >
                              Allot Ticket
                            </button>
                          )}
                        </td>

                        <td className="p-3 border border-gray-800 text-gray-400 text-xs text-center">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Summary Card
const SummaryCard = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} p-[1px] rounded-2xl shadow-lg`}>
    <div className="bg-gray-900 p-5 rounded-2xl h-full flex flex-col justify-between">
      <h4 className="text-gray-300 text-sm">{title}</h4>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  </div>
);

export default EventOrdersDashboard;
