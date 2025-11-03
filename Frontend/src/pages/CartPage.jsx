import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Listen for Firebase authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // console.log("✅ Firebase user:", firebaseUser.uid);
        setUser(firebaseUser);
        fetchCart(firebaseUser.uid);
      } else {
        setUser(null);
        setCartItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🧾 Fetch cart items from backend
  const fetchCart = async (uid) => {
    if (!uid) return console.error("❌ UID missing — not fetching cart");

    // console.log("📦 Fetching cart for UID:", uid);
    try {
      const res = await axios.get(`${BACKEND_URI}/api/cart/${uid}`);
    //   console.log("🛍️ Cart response:", res.data);
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Increase Quantity
const increaseQty = async (pricingId) => {
  try {
    await axios.put(`${BACKEND_URI}/api/cart/update`, {
      uid: user.uid, // ✅ FIXED: use 'uid'
      pricingId,
      action: "increase",
    });
    fetchCart(user.uid); // ✅ consistent
  } catch (err) {
    console.error("Error increasing quantity:", err);
  }
};

// ➖ Decrease Quantity
const decreaseQty = async (pricingId) => {
  try {
    await axios.put(`${BACKEND_URI}/api/cart/update`, {
      uid: user.uid, // ✅ FIXED
      pricingId,
      action: "decrease",
    });
    fetchCart(user.uid);
  } catch (err) {
    console.error("Error decreasing quantity:", err);
  }
};

// ❌ Delete item
const deleteItem = async (pricingId) => {
  try {
    await axios.delete(`${BACKEND_URI}/api/cart/delete`, {
      data: { uid: user.uid, pricingId }, // ✅ FIXED
    });
    fetchCart(user.uid);
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};


  // 💰 Calculate Total
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.totalPrice ||
        (item.pricingId?.finalPrice || item.pricingId?.price || 0) *
          item.quantity),
    0
  );

// 💳 Razorpay Checkout
const handleCheckout = async () => {
  if (!user) return alert("Please login first!");

  try {
    // Step 1️⃣: Create Razorpay order from backend
    const { data } = await axios.post(`${BACKEND_URI}/api/bookings/create-order`, {
      userId: user.uid,
    });

    // Step 2️⃣: Configure Razorpay payment options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: data.currency,
      name: "Event Ticket Booking",
      description: "Secure ticket booking via Razorpay",
      image: "/logo.png", // optional
      order_id: data.orderId,
      handler: async function (response) {
        try {
          // Step 3️⃣: Verify payment and create booking in backend
          const verifyRes = await axios.post(`${BACKEND_URI}/api/bookings/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: user.uid,
          });

          if (verifyRes.data.success) {
            alert("🎟️ Booking confirmed successfully!");
            navigate("/myBookings");
          } else {
            alert("❌ Payment verification failed");
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          alert("Something went wrong verifying the payment.");
        }
      },
      prefill: {
        name: user.displayName || "Guest User",
        email: user.email,
        contact: "9999999999",
      },
      theme: {
        color: "#c026d3",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

    razor.on("payment.failed", function (response) {
      alert("❌ Payment failed. Try again.");
      console.error(response.error);
    });
  } catch (err) {
    console.error("Error during checkout:", err);
    alert("Something went wrong during checkout.");
  }
};


  // 🔒 Show message if user not logged in
  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <p className="text-lg text-gray-400 mb-4">
            Please log in to view your cart.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full"
          >
            Login Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 🛒 Header */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <ShoppingCart size={36} className="text-pink-500" />
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Ticket Cart
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="text-lg mb-4">Your cart is empty. Add some tickets!</p>
            <button
              onClick={() => navigate("/eventSchedules")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-full hover:scale-105 transition-transform"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            {/* 🧾 Cart List */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 divide-y divide-gray-800">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row justify-between items-center py-6"
                >
                  <div className="flex items-center gap-6 w-full md:w-2/3">
                    <img
                      src={
                        item.pricingId?.event?.imageUrl || "/ticket-placeholder.png"
                      }
                      alt={item.pricingId?.event?.title || "Event"}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-700"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {item.pricingId?.event?.title || "Event Name"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.pricingId?.ticketType} Ticket
                      </p>
                      <p className="text-pink-400 font-semibold">
                        ₹
                        {(
                          item.pricingId?.finalPrice ||
                          item.pricingId?.price ||
                          0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button
                      onClick={() => decreaseQty(item.pricingId._id)}
                      className="p-2 rounded-full bg-gray-800 hover:bg-pink-600 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.pricingId._id)}
                      className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteItem(item.pricingId._id)}
                    className="mt-4 md:mt-0 p-2 bg-gray-800 hover:bg-red-600 rounded-full transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="flex justify-between items-center mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-2xl font-bold text-pink-400">
                ₹{totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-10">
  <button
    onClick={handleCheckout}
    className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(216,0,255,0.4)]"
  >
    Proceed to Checkout →
  </button>
</div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
