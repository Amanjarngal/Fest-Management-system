import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const leaders = [
  { name: "Aman Sharma", role: "Event Leader", img: "https://i.pravatar.cc/200?img=5" },
  { name: "Priya Singh", role: "Managing Head", img: "https://i.pravatar.cc/200?img=15" },
  { name: "Karan Mehta", role: "Operations Lead", img: "https://i.pravatar.cc/200?img=20" }
];

const TeamLeadersSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 bg-black text-white relative overflow-hidden">

      {/* Background subtle glow */}
      <div className="absolute w-[30rem] h-[30rem] bg-pink-600/10 blur-[180px] -top-10 left-10"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-purple-700/10 blur-[180px] bottom-0 right-10"></div>

      {/* Heading */}
      <h2 className="text-center text-5xl font-extrabold mb-16 relative z-10">
        Meet the <span className="text-pink-400">Organizing Team</span>
      </h2>

      {/* Leaders Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6 relative z-10">
        {leaders.map((l, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md shadow-lg hover:shadow-pink-500/40 transition text-center"
          >
            <img
              src={l.img}
              className="w-32 h-32 rounded-full mx-auto mb-4 border border-white/20 shadow-lg"
              alt={l.name}
            />
            <h3 className="text-2xl font-bold">{l.name}</h3>
            <p className="text-pink-400 font-semibold mt-1">{l.role}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mt-24 text-center relative z-10"
      >
        <h3 className="text-4xl font-extrabold mb-4">
          Join the <span className="text-purple-400">Celebration!</span>
        </h3>

        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          Be a part of one of the most vibrant and energetic college festivals.
          Whether you want to participate, showcase your talent, or volunteer —
          this is your moment to shine!
        </p>

         <button
        onClick={() => navigate("/eventSchedules")}
        className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full 
        text-lg font-semibold shadow-lg shadow-pink-500/30 hover:scale-105 transition"
      >
        Register Now →
      </button>
      </motion.div>

    </section>
  );
};

export default TeamLeadersSection;
