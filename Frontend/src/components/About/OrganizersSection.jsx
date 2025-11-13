import { motion } from "framer-motion";

const organizers = [
  { name: "Dr. Rahul Verma", role: "Fest Coordinator", img: "https://i.pravatar.cc/200?img=12" },
  { name: "Dr. Kavita Sharma", role: "Cultural Head", img: "https://i.pravatar.cc/200?img=30" },
  { name: "Prof. Amit Singh", role: "Technical Lead", img: "https://i.pravatar.cc/200?img=55" }
];

const OrganizersSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">

      <h2 className="text-center text-5xl font-extrabold mb-16">
        Meet The <span className="text-pink-400">Organizers</span>
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-6">
        {organizers.map((o, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md shadow-lg hover:shadow-pink-500/30 transition text-center"
          >
            <img
              src={o.img}
              className="w-32 h-32 rounded-full mx-auto mb-4 border border-white/20"
              alt={o.name}
            />
            <h3 className="text-xl font-bold">{o.name}</h3>
            <p className="text-pink-400 font-medium mt-1">{o.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OrganizersSection;
