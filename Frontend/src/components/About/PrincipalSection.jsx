import { motion } from "framer-motion";

const PrincipalSection = () => {
  return (
    <section className="py-28 bg-black text-white relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-[30rem] h-[30rem] bg-pink-600/10 blur-[180px] -top-20 left-10"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-purple-700/10 blur-[180px] bottom-0 right-10"></div>

      {/* Section Heading */}
      <h2 className="text-center text-5xl font-extrabold mb-20 relative z-10">
        Words from Our <span className="text-pink-400">Leaders</span>
      </h2>

      <div className="max-w-6xl mx-auto px-8 space-y-24 relative z-10">

        {/* Chairman Message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://agcamritsar.in/agclegacy/chairman.jpg"
            alt="Chairman"
            className="rounded-3xl border border-white/10 shadow-xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">
              Chairman's <span className="text-pink-400">Message</span>
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              “Our annual fest stands as a true reflection of our institution’s values —  
              creativity, unity, and excellence. Each year, our students bring fresh ideas  
              and immense enthusiasm, turning this event into something extraordinary.  
              I congratulate every participant and organizer for their dedication and passion.”
            </p>

            <p className="text-pink-400 font-bold mt-4">–Adv. Amit Sharma (Chairman & CEO)</p>
          </motion.div>
        </div>

        {/* Principal Message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center md:flex-row-reverse md:[&>*:first-child]:order-2">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="https://agcamritsar.in/agclegacy/gaurav-sir.jpg"
            alt="Principal"
            className="rounded-3xl border border-white/10 shadow-xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">
              Principal's <span className="text-pink-400">Message</span>
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              “Our fest is not just an event — it is a celebration of passion,  
              teamwork, and excellence. Watching our students innovate, lead,  
              and perform fills us with pride. This festival brings the entire  
              campus together and creates memories that last a lifetime.”
            </p>

            <p className="text-pink-400 font-bold mt-4">–Dr. Gaurav Tejpal , Principal</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default PrincipalSection;
