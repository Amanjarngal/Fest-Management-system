import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
      <h1 className="text-3xl font-bold text-green-400 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-300 mb-6">Your tickets have been booked successfully.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default SuccessPage;
