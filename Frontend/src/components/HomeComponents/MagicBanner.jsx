import React from "react";
import { Sparkles } from "lucide-react";

const MagicBanner = () => {
  return (
    <div className="relative overflow-hidden bg-black py-12">
        
      {/* Continuous sliding container */}
      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
        <MagicText text="Magic Of Events" />
        <Sparkles className="text-pink-500 w-8 h-8 animate-pulse" />
        <MagicText text="Celebrate Life" />
        <Sparkles className="text-purple-500 w-8 h-8 animate-pulse" />
        <MagicText text="Unite Through Moments" />
        <Sparkles className="text-pink-500 w-8 h-8 animate-pulse" />
      </div>
    </div>
  );
};

// Text Component with outline and hover fill
const MagicText = ({ text }) => (
  <h1
    className="text-[3rem] md:text-[5rem] font-extrabold text-transparent text-outline hover:text-white transition-all duration-700 cursor-default"
  >
    {text}
  </h1>
);

export default MagicBanner;
