import React from "react";
import { useNavigate } from "react-router-dom";     
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
     const navigate = useNavigate();
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* 🎥 Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://elementscdn.b-cdn.net/2025aftermovie_full.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🖤 Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

{/* ✨ Content */}
<div className="relative z-20 text-white px-4 max-w-3xl text-center">
  {/* 🌟 Fest Title */}
  <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-wide drop-shadow-lg">
    FestoMania 2025
  </h1>

  {/* 📅 Dates */}
  <p className="mt-2 text-lg md:text-2xl font-semibold text-cyan-100">
    <strong>December 10 – 12, 2025 | Amritsar Group of Colleges</strong>
  </p>

  {/* ✨ Tagline */}
  <p className="mt-4 text-lg text-gray-200">
    Where Innovation Meets Celebration 🚀
  </p>

 {/* 🎟 Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/gallery")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold transition-all shadow-md hover:opacity-90"
          >
            STEP INTO THE MEMORIES
          </button>
          <button
            onClick={() => navigate("/eventSchedules")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 text-white font-semibold transition-all shadow-md hover:opacity-90"
          >
            BUY TICKETS
          </button>
        </div>

</div>


      {/* ⬇️ Scroll Indicator */}
      <div className="absolute bottom-8 z-20 text-white text-sm tracking-wider flex flex-col items-center animate-bounce">
        <span>SCROLL DOWN</span>
        <ChevronDown className="mt-1" size={20} />
      </div>
    </section>
  );
};

export default HeroSection;
