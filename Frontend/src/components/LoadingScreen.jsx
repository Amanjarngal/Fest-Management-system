import React from "react";
import { Loader2 } from "lucide-react";

const LoadingScreen = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#05010a] text-white z-50">
      {/* Animated Gradient Glow Circle */}
      <div className="relative flex justify-center items-center mb-6">
        <div className="absolute w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-500 blur-2xl opacity-40 animate-pulse"></div>
        <Loader2 className="w-14 h-14 text-yellow-400 animate-spin relative z-10" />
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
        {text}
      </h2>

      {/* Subtext shimmer */}
      <p className="mt-2 text-gray-400 text-sm animate-pulse">
        Please wait while we fetch your data...
      </p>
    </div>
  );
};

export default LoadingScreen;
