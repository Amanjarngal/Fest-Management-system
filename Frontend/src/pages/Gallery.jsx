import React from "react";

const images = [
  { src: "https://images.unsplash.com/photo-1598387847521-8e3e1f5e2e5a", title: "Dream Makers Event Planning", tag: "Gala Affairs" },
  { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4", title: "Corporate Summit", tag: "Business Meet" },
  { src: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229", title: "Wedding Celebration", tag: "Luxury Event" },
  { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", title: "Music Night", tag: "Concert" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", title: "Fashion Show", tag: "Style Event" },
  { src: "https://images.unsplash.com/photo-1515169067865-5387ec356754", title: "Cultural Fest", tag: "College Event" },
  { src: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913", title: "Startup Expo", tag: "Innovation" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9", title: "Dance Competition", tag: "Stage Event" },
];

const Gallery = () => {
  return (
    <section className="min-h-screen bg-[#0b0b12] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Event Gallery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((item, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.title || "Event"}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay (like screenshot style) */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 transition-all duration-500 ${
                  index === 0
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <p className="text-sm text-purple-400 mb-1">{item.tag}</p>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>

              {/* Soft glow on hover */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
