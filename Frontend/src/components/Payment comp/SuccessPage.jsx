import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { ticketOrderId, amount, items } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black px-6">
      
      <h1 className="text-3xl font-bold text-green-400 mb-4">
        🎉 Payment Successful!
      </h1>

      <p className="text-gray-300 mb-2">Your tickets have been booked successfully.</p>

      {/* Ticket Order ID Section */}
      {ticketOrderId && (
        <div className="bg-gray-800 p-5 rounded-xl mt-4 shadow-lg border border-gray-700 w-full max-w-lg text-center">
          <h2 className="text-lg font-semibold text-pink-400">
            Your Ticket Order ID
          </h2>
          <p className="text-2xl font-bold text-white mt-2 tracking-widest">
            {ticketOrderId}
          </p>

          {/* Screenshot Warning Line */}
          <p className="text-yellow-400 mt-3 font-medium text-sm">
            ⚠️ Please take a screenshot of this Order Ticket ID and show it at the ticket counter.
          </p>
        </div>
      )}

      {/* Amount Section */}
      {amount && (
        <div className="bg-gray-800 p-4 rounded-xl mt-5 shadow-lg border border-gray-700 text-center w-full max-w-lg">
          <p className="text-gray-300">Total Amount Paid</p>
          <p className="text-2xl font-bold text-green-400">
            ₹{amount}
          </p>
        </div>
      )}

      {/* Ticket Items */}
      {items && items.length > 0 && (
        <div className="bg-gray-900 p-5 rounded-xl mt-6 shadow-inner w-full max-w-xl border border-gray-800">
          <h3 className="text-xl font-semibold text-pink-400 mb-4 text-center">
            Purchased Tickets
          </h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-gray-300 py-2 border-b border-gray-700"
            >
              <span>{item.eventId?.title || "Event"}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default SuccessPage;
