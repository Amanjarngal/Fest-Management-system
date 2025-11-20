import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, Store, ShoppingCart } from "lucide-react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MyStallOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) fetchUserOrders(user.uid);
      else setLoading(false);
    });
    return () => unsub();
  }, []);

  const fetchUserOrders = async (uid) => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const res = await axios.get(
        `${BACKEND_URI}/api/razorpay/stalls/user-orders/${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching stall orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-white">
        <Loader2 className="animate-spin" /> Loading your stall orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-gray-400 text-lg text-center py-10">
        🍽️ You have not ordered from any stalls yet.
      </div>
    );

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 mt-10 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
        <ShoppingCart size={28} /> My Stall Orders
      </h2>

      {orders.map((order, idx) => (
        <div
          key={idx}
          className="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700"
        >
          {/* Stall Name */}
          <h3 className="text-2xl font-bold flex items-center gap-2 text-yellow-300 mb-4">
            <Store size={22} /> {order.stallId?.name || "Food Stall"}
          </h3>

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 p-4 rounded-lg border border-gray-700"
              >
                <p className="text-lg font-bold text-white">{item.name}</p>

                <p className="text-gray-300 text-sm mt-1">
                  Quantity: <b>{item.quantity}</b>
                </p>

                <p className="text-emerald-400 font-semibold text-sm">
                  Price: ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* Total + Token */}
          <div className="flex justify-between items-center mt-5 border-t border-gray-700 pt-4">
            <p className="text-green-400 text-xl font-bold">
              Total: ₹{order.totalAmount}
            </p>

            <div className="text-right">
              <p className="text-gray-400 text-sm">Your Token Number</p>
              <p className="text-4xl font-extrabold text-emerald-400 tracking-wide">
                {order.tokenNumber}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyStallOrders;
