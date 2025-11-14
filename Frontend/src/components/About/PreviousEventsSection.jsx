import { motion } from "framer-motion";

const events = [
  {
    year: "2024 Fest – Ignite the Future",
    text: "The 2023 Fest was a massive explosion of creativity and innovation. With over 12,000+ attendees, the event featured electrifying DJ nights, technical hackathons, street plays, dance battles, and a spectacular fashion show.",
    highlights: [
      "DJ Shadow Dubai & Rock Band ‘Agnee’",
      "Hackathon: 300+ participants",
      "50+ cultural & sports competitions",
      "Food Fest with 40+ stalls",
      "Drone show & AR experience zone"
    ],
    img: "https://admin.hire4event.com/assets/primaryimage/822483d0608e247d1dcfafb6b6d30af1.jpg",
  },
  {
    year: "2023 Fest – Rise Again",
    text: "The first grand celebration after the pandemic! Students returned with unmatched energy, turning 2022 into one of the most emotional and vibrant fest editions.",
    highlights: [
      "Stand-Up with Zakir Khan",
      "Inter-college coding championship",
      "Traditional Day Parade",
      "Photography & short-film competitions",
      "Sports Cup events"
    ],
    img: "https://ticketor.net/usercontent/125924/evf/198500.jpg",
  },
  {
    year: "2022 Fest – Colors of Youth",
    text: "A vibrant celebration that captured the spirit of youth with open mic performances, art installations, rock concerts, and sports tournaments.",
    highlights: [
      "Rock Concert: ‘Indian Ocean’",
      "Art Street: 100+ artworks",
      "Dance & Talent showcase",
      "LAN Gaming Tournament",
      "Campus-wide flash mobs"
    ],
    img: "https://s3.amazonaws.com/eventticketscenter/images/performers/concert-poprock-get-the-led-out--tribute-ban.webp",
  },
];

const PreviousEventsSection = () => {
  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">

      {/* Background glows (kept subtle) */}
      <div className="absolute w-[35rem] h-[35rem] bg-pink-600/5 blur-[200px] -top-20 left-10"></div>
      <div className="absolute w-[35rem] h-[35rem] bg-purple-700/5 blur-[200px] bottom-0 right-10"></div>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <h2 className="text-center text-5xl font-extrabold mb-20 relative z-10">
        Previous <span className="text-pink-400">Fest Editions</span>
      </h2>

      <div className="space-y-28 max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        {events.map((e, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-14 items-center ${
              idx % 2 === 1 ? "md:flex-row-reverse md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image (Clean version) */}
            <motion.img
              src={e.img}
              alt="event"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative rounded-3xl shadow-xl border border-white/10"
            />

            {/* Text Section */}
            <div className="px-2 md:px-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text mb-4">
                {e.year}
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed mb-4">{e.text}</p>

              <ul className="mt-4 space-y-2">
                {e.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-pink-400 text-xl">●</span> {item}
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PreviousEventsSection;
