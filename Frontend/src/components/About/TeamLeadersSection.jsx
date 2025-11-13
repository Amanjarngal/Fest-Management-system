import { motion } from "framer-motion";

const leaders = [
  { name: "Aman Sharma", role: "Event Leader", img: "https://i.pravatar.cc/200?img=5" },
  { name: "Priya Singh", role: "Managing Head", img: "https://i.pravatar.cc/200?img=15" },
  { name: "Karan Mehta", role: "Operations Lead", img: "https://i.pravatar.cc/200?img=20" }
];

const TeamLeadersSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">

      <h2 className="text-center text-5xl font-extrabold mb-16">
        Student <span className="text-pink-400">Leaders</span>
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6">
        {leaders.map((l, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md shadow-lg hover:shadow-purple-500/40 transition text-center"
          >
            <img
              src={l.img}
              className="w-32 h-32 rounded-full mx-auto mb-4 border border-white/20"
              alt={l.name}
            />
            <h3 className="text-xl font-bold">{l.name}</h3>
            <p className="text-purple-400 font-medium mt-1">{l.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamLeadersSection;
