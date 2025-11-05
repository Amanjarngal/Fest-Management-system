import React from "react";

const sponsors = [
  {
    name: "Spotify",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
  {
    name: "Coca Cola",
    image:
      "https://brandlogos.net/wp-content/uploads/2022/10/coca-cola-logo_brandlogos.net_8kh4z-512x512.png",
  },
  {
    name: "Nike",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlAHSjq7Gk3-FboSL_OMkC42bdCkxD12e4mw&s",
  },
  {
    name: "Red Bull",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd1B2RGP2wundVSkvDkSyPLMmDLoewGqc3iQ&s",
  },
  {
    name: "Samsung",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyE8SM1sAEeUbY4ZwUxF2x3NPyjvGl5IOPDw&s",
  },
  {
    name: "Intel",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV9Edqk86_dWRtwW1FFZzqYbVGTSuw23tzNg&s",
  },
];

const Sponsors = () => {
  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* 🔮 Glowing Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* 🌟 Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-pink-400 text-sm font-semibold tracking-widest mb-2">
          // Our Sponsors //
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug">
          Powered by <span className="text-pink-500">Our Partners</span>
        </h2>
      </div>

      {/* 🧱 Static Grid of Sponsors */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 sm:gap-14 justify-items-center items-center">
          {sponsors.map((s, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <img
                src={s.image}
                alt={s.name}
                className="h-12 sm:h-16 md:h-20 object-contain brightness-125 grayscale hover:grayscale-0 transition-all duration-300"
              />
              <p className="text-gray-400 mt-3 text-xs sm:text-sm font-medium group-hover:text-pink-400 transition-all">
                {s.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🌈 Gradient Edges */}
      <div className="absolute left-0 top-0 h-full w-24 sm:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-24 sm:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Sponsors;
