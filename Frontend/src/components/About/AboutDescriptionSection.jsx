import { motion } from "framer-motion";

const AboutDescriptionSection = () => {
  return (
    <section className="relative py-32 bg-black text-white overflow-hidden">

      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

       {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      <div className="max-w-7xl mx-auto px-6 mx-8 md:mx-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">


        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Our Fest</span>
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Our annual college fest is a grand celebration of culture,
            creativity, technology, talent, and teamwork. It brings together
            thousands of enthusiastic students from across departments to
            showcase skills in dance, music, art, coding, gaming, sports,
            fashion, drama, and much more.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            What started as a small intra-college gathering has now evolved into
            one of the most awaited youth festivals of the region — filled with
            high-energy performances, competitive events, celebrity nights,
            food stalls, workshops, and unforgettable memories.
          </p>

          {/* Highlights */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-pink-400 text-xl">●</span>
              <p className="text-gray-300">50+ Competitions across cultural, technical & sports domains</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-xl">●</span>
              <p className="text-gray-300">10,000+ Participants every year</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">●</span>
              <p className="text-gray-300">Celebrity Performances & Star Nights</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">●</span>
              <p className="text-gray-300">Workshops, Stalls, Games, and Innovation Expo</p>
            </div>
          </div>

          {/* Button */}
          {/* <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl 
            shadow-lg shadow-pink-500/20 hover:scale-105 transition font-semibold"
          >
            View Previous Events →
          </motion.button> */}
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/40 to-purple-500/40 blur-2xl opacity-40"></div>

          <motion.img
            src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b"
            className="relative rounded-3xl shadow-xl border border-white/10"
            alt="Fest celebration"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 150 }}
          />

          {/* Floating shapes */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "mirror" }}
            className="absolute -top-6 -right-6 w-20 h-20 bg-pink-500/30 rounded-2xl blur-sm"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ repeat: Infinity, duration: 4, repeatType: "mirror" }}
            className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/30 rounded-full blur-sm"
          ></motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutDescriptionSection;
