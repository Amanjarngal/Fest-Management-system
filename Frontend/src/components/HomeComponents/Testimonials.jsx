import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aman Sharma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review:
      "An electrifying experience! The fest was full of life, music, and energy. The performers were top-notch and everything ran perfectly.",
  },
  {
    name: "Priya Mehta",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    review:
      "Amazing vibes, great artists, and superb management. Definitely attending again next year!",
  },
  {
    name: "Rohit Verma",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    rating: 5,
    review:
      "Best college fest experience ever! The ticketing system worked flawlessly and the atmosphere was electric!",
  },
  {
    name: "Sneha Kapoor",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    rating: 4,
    review:
      "Loved every bit of it! The lighting, food, and crowd were perfect. Hoping for even more performances next time.",
  },
  {
    name: "Vikas Patel",
    image: "https://randomuser.me/api/portraits/men/20.jpg",
    rating: 5,
    review:
      "One word — Awesome! Great organization and spectacular artist line-up. The entire experience was unforgettable!",
  },
  {
    name: "Aditi Singh",
    image: "https://randomuser.me/api/portraits/women/62.jpg",
    rating: 5,
    review:
      "So much fun! Loved the energy, the people, and the overall vibe. Everything was smooth and enjoyable.",
  },
  {
    name: "Karan Joshi",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4,
    review:
      "Super smooth event! I could easily book tickets, check schedules, and enjoy the show without any hassle.",
  },
];

const Testimonials = () => {
  // Duplicate testimonials for smooth infinite scrolling
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
      {/* 🌈 Glowing Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-600/20 blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-600/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* ✨ Header */}
      <div className="text-center mb-14 px-6 relative z-10">
        <p className="text-pink-400 text-sm font-semibold tracking-widest mb-2">
          // What People Say //
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Reviews About <span className="text-pink-500">Fest System</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-sm md:text-base">
          Here’s what our amazing attendees have to say about their fest
          experience — energy, excitement, and pure fun!
        </p>
      </div>

      {/* 🌀 Smooth Sliding Carousel */}
      <div className="relative overflow-hidden w-full">
        <motion.div
          className="flex gap-8 sm:gap-10 md:gap-12 px-6"
          animate={{ x: ["0%", "-50%"] }} // slide halfway (since we doubled the list)
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
          style={{ width: "fit-content" }}
        >
          {doubledTestimonials.map((t, index) => (
            <div
              key={index}
              className="w-72 sm:w-80 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 flex-shrink-0 shadow-lg hover:shadow-pink-500/20 transition-all duration-300 text-center backdrop-blur-md"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-pink-500/50 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-pink-400 mb-2">
                {t.name}
              </h3>

              {/* ⭐ Star Ratings */}
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < t.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                "{t.review}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 🎨 Gradient Edges */}
      <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Testimonials;
