import React from "react";
import { CheckCircle } from "lucide-react";

const TokenOrderModal = ({ tokenNumber, onClose }) => {
  if (!tokenNumber) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center shadow-xl max-w-sm w-full">
        <CheckCircle className="text-green-400 mx-auto mb-4" size={60} />
        <h2 className="text-2xl font-bold mb-2 text-white">Payment Successful!</h2>
        <p className="text-gray-400 mb-4">Your order has been confirmed.</p>

        <div className="bg-yellow-400 text-black font-extrabold text-3xl py-3 rounded-xl mb-4 shadow-inner">
          TOKEN #{tokenNumber}
        </div>

        <p className="text-gray-300 text-sm mb-4">
          Please go to the stall counter and show this token to collect your order.
        </p>

        <button
          onClick={onClose}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenOrderModal;
