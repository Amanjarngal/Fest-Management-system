import { motion } from "framer-motion";

const AboutDescriptionSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      
      {/* Glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-500/20 blur-[170px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-500/20 blur-[170px] bottom-0 right-10"></div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            About <span className="text-pink-400">Our Fest</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Our annual college fest is a vibrant celebration of culture, creativity,
            competitions, and community. Every year thousands of students participate
            in events, showcasing their talents in dance, singing, drama, coding,
            sports, fashion, art, and more.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            The fest aims to bring students together, build confidence, promote
            teamwork, and create unforgettable memories that last a lifetime.
          </p>
        </motion.div>

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b"
          className="rounded-3xl shadow-lg border border-white/10 hover:shadow-pink-500/30 transition"
          alt="Fest celebration"
        />
      </div>
    </section>
  );
};

export default AboutDescriptionSection;
