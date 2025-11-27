import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const StallOrdersDashboard = () => {
  const [stalls, setStalls] = useState([]);
  const [expandedStall, setExpandedStall] = useState(null);
  const [stallOrders, setStallOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  // ✅ Fetch all stalls
  const fetchStalls = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/stalls`);
      setStalls(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load stalls");
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  // ✅ Fetch orders per stall
  const fetchStallOrders = async (stallId) => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) return toast.error("Please login first!");

      const res = await axios.get(
        `${BACKEND_URI}/api/razorpay/stalls/stall/${stallId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStallOrders((prev) => ({ ...prev, [stallId]: res.data }));
    } catch (err) {
      console.error("❌ Failed to fetch stall orders:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to fetch stall orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle stall expansion
  const toggleStall = (stallId) => {
    if (expandedStall === stallId) {
      setExpandedStall(null);
    } else {
      setExpandedStall(stallId);
      if (!stallOrders[stallId]) fetchStallOrders(stallId);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Stall Orders Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-l">
            Track sales and orders from all food stalls in real-time
          </p>
        </div>

        {/* Stall List */}
        {stalls.length === 0 ? (
          <p className="text-gray-400 text-center py-10 text-lg">
            No stalls available yet.
          </p>
        ) : (
          stalls.map((stall) => {
            const isOpen = expandedStall === stall._id;
            const orderData = stallOrders[stall._id];

            return (
              <div
                key={stall._id}
                className="mb-6 bg-[#0B0B0F] border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/10 transition-all duration-300"
              >
                {/* Stall Header */}
                <div
                  onClick={() => toggleStall(stall._id)}
                  className="flex justify-between items-center px-5 py-4 cursor-pointer bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 hover:from-yellow-500/10 hover:to-transparent transition"
                >
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {stall.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      👤 Owner:{" "}
                      <span className="text-gray-300 font-medium">
                        {stall.ownerName || "Unknown"}
                      </span>{" "}
                      • 📍 Location:{" "}
                      <span className="text-gray-300">
                        {stall.location || "Not specified"}
                      </span>
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="text-yellow-400 w-6 h-6" />
                  ) : (
                    <ChevronDown className="text-yellow-400 w-6 h-6" />
                  )}
                </div>

                {/* Orders Section */}
                <div
                  className={`transition-all overflow-hidden ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-gray-950 p-6 border-t border-gray-800">
                    {loading ? (
                      <div className="flex justify-center py-8 text-yellow-400">
                        <Loader2 className="animate-spin w-6 h-6" />
                      </div>
                    ) : orderData?.orders?.length ? (
                      <>
                        {/* Summary Cards */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 text-center shadow-md">
                            <h4 className="text-gray-400 text-sm mb-1">
                              Total Orders
                            </h4>
                            <p className="text-3xl font-bold text-yellow-400">
                              {orderData.orderCount}
                            </p>
                          </div>
                          <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 text-center shadow-md">
                            <h4 className="text-gray-400 text-sm mb-1">
                              Total Sales
                            </h4>
                            <p className="text-3xl font-bold text-green-400">
                              ₹{orderData.totalSales}
                            </p>
                          </div>
                        </div>

                        {/* Orders Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-800 text-sm sm:text-base rounded-xl overflow-hidden">
                            <thead className="bg-[#111111] text-gray-300">
                              <tr>
                                <th className="p-3 border border-gray-800">Token #</th>
                                <th className="p-3 border border-gray-800">User Name</th>
                                <th className="p-3 border border-gray-800">Items</th>
                                <th className="p-3 border border-gray-800">Amount</th>
                                <th className="p-3 border border-gray-800">Status</th>
                                <th className="p-3 border border-gray-800">Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderData.orders.map((order, index) => (
                                <tr
                                  key={order._id}
                                  className={`transition ${
                                    index % 2 === 0
                                      ? "bg-gray-900/40"
                                      : "bg-gray-900/20"
                                  } hover:bg-yellow-500/5`}
                                >
                                  <td className="p-3 border border-gray-800 text-yellow-400 font-semibold">
                                    #{order.tokenNumber}
                                  </td>
                                  <td className="p-3 border border-gray-800 text-gray-300 font-medium">
  {order.userName || "Unknown User"}
</td>


                                  {/* ✅ Updated Items Section */}
                                  <td className="p-3 border border-gray-800 text-gray-300">
                                    <ul className="space-y-1 text-sm">
                                      {order.items?.map((it, i) => (
                                        <li key={i}>
                                          🍴{" "}
                                          <span className="font-semibold text-white">
                                            {it.name}
                                          </span>{" "}
                                          — {it.quantity} × ₹{it.price}
                                        </li>
                                      ))}
                                    </ul>
                                  </td>

                                  <td className="p-3 border border-gray-800 font-semibold text-green-400">
                                    ₹{order.totalAmount}
                                  </td>
                                  <td className="p-3 border border-gray-800">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.paymentStatus === "SUCCESS"
                                          ? "bg-green-600/20 text-green-400"
                                          : "bg-red-600/20 text-red-400"
                                      }`}
                                    >
                                      {order.paymentStatus}
                                    </span>
                                  </td>
                                  <td className="p-3 border border-gray-800 text-xs text-gray-400">
                                    {new Date(order.createdAt)?.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center py-5 italic">
                        No orders found for this stall yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StallOrdersDashboard;
