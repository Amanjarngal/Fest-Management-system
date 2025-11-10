import React from "react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
      <h1 className="text-3xl font-bold text-red-400 mb-4">❌ Payment Cancelled</h1>
      <p className="text-gray-300 mb-6">No charges were made. You can try again.</p>
      <button
        onClick={() => navigate("/cart")}
        className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full"
      >
        Back to Cart
      </button>
    </div>
  );
};

export default CancelPage;
