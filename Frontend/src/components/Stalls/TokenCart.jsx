import React, { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const TokenCart = ({
  cart,
  cartLoading,
  setCartOpen,
  changeQty,
  removeFromCart,
  cartTotal,
  setOrderModalOpen,
  user,
  clearCart, // 👈 optional callback to clear stall cart after success
  setTokenNumber, // 👈 to show token modal
}) => {

  // ✅ Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

 // ✅ Razorpay checkout handler
const handleStallPayment = async () => {
  if (cart.length === 0) return toast.error("Cart is empty");
  if (!user) return toast.error("Please login first!");

  try {
    const totalAmount = cartTotal();

    // 🔐 Step 0️⃣: Get Firebase Auth Token
    const token = await user.getIdToken(); // ✅ get fresh token

    // 🪙 Step 1️⃣: Create order on backend
    const { data } = await axios.post(
      `${BACKEND_URI}/api/razorpay/stalls/create-order`,
      { totalAmount },
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ include token
      }
    );

    if (!data?.order?.id) return toast.error("Failed to create Razorpay order");

    // 🎟️ Step 2️⃣: Razorpay Checkout modal setup
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "College Fest - Food Stalls",
      description: "Payment for stall items",
      order_id: data.order.id,
      prefill: {
        name: user.displayName || "Fest Attendee",
        email: user.email || "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#facc15" },
      handler: async (response) => {
        try {
          // 🧾 Step 3️⃣: Verify payment + save stall order
          const verifyRes = await axios.post(
  `${BACKEND_URI}/api/razorpay/stalls/verify-payment`,
  {
    uid: user.uid,
    stallId: cart[0]?.stallId, // ✅ use actual stallId from cart items
    items: cart.map((it) => ({
      itemId: it.itemId, // ✅ send correct itemId
      quantity: it.quantity,
      price: it.price,
    })),
    totalAmount,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


          if (verifyRes.data.success) {
            // ✅ Payment success
            const tokenNumber = verifyRes.data.tokenNumber || Math.floor(1000 + Math.random() * 9000);
            setTokenNumber(tokenNumber);
            toast.success("🎉 Payment Successful! Token Generated");
            clearCart?.();
            setCartOpen(false);
            setOrderModalOpen(true);
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (verifyErr) {
          console.error("❌ Verify stall payment error:", verifyErr);
          toast.error("Something went wrong verifying payment");
        }
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("❌ Stall Payment Error:", err);
    toast.error("Something went wrong while processing payment");
  }
};

  return (
    <div className="fixed right-6 bottom-6 w-96 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white">
          <X />
        </button>
      </div>

      {/* Items */}
      {cartLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : cart.length === 0 ? (
        <p className="text-gray-400">Cart is empty.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-auto">
          {cart.map((it) => (
            <div
              key={it.itemId}
              className="flex items-center justify-between gap-3 border-b border-gray-800 pb-2"
            >
              <div>
                <div className="text-sm font-semibold">{it.name}</div>
                <div className="text-xs text-gray-400">
                  ₹{it.price} × {it.quantity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(it.itemId, -1)}
                  className="bg-gray-800 px-2 py-1 rounded"
                >
                  <Minus size={14} />
                </button>
                <span>{it.quantity}</span>
                <button
                  onClick={() => changeQty(it.itemId, 1)}
                  className="bg-gray-800 px-2 py-1 rounded"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeFromCart(it.itemId)}
                  className="ml-2 text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 border-t border-gray-800 pt-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-400">Total</span>
          <span className="text-lg font-bold">₹{cartTotal().toFixed(2)}</span>
        </div>
        <button
          onClick={handleStallPayment}
          className="w-full btn-gradient  text-black py-2 rounded-md font-semibold"
        >
          Proceed to Pay & Generate Token
        </button>
      </div>
    </div>
  );
};

export default TokenCart;
