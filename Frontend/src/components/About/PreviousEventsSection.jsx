import { motion } from "framer-motion";

const events = [
  {
    year: "2023 Fest",
    text: "An explosive year of talent! From live concerts to coding marathons, students showcased passion and skill.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
  },
  {
    year: "2022 Fest",
    text: "One of the biggest gatherings post-pandemic with energetic competitions and cultural programs.",
    img: "https://images.unsplash.com/photo-1515165562835-c4c4c4c4c4c4"
  },
  {
    year: "2019 Fest",
    text: "A colorful celebration full of creativity, performances, sports, and unforgettable memories.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  }
];

const PreviousEventsSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">

      {/* Glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-purple-600/20 blur-[180px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/20 blur-[180px] bottom-0 right-10"></div>

      <h2 className="text-center text-5xl font-extrabold mb-16">
        Past <span className="text-pink-400">Events</span>
      </h2>

      <div className="space-y-20 max-w-6xl mx-auto px-6">
        {events.map((e, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <img
              src={e.img}
              alt="event"
              className="rounded-3xl shadow-lg border border-white/10 hover:shadow-pink-500/30 transition"
            />

            <div>
              <h3 className="text-3xl font-bold mb-3">{e.year}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{e.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PreviousEventsSection;
 