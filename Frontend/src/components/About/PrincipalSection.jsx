import { motion } from "framer-motion";

const PrincipalSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">

      <div className="absolute w-[25rem] h-[25rem] bg-pink-500/20 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-600/20 blur-[150px] bottom-0 right-10"></div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <motion.img
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
          alt="Principal"
          className="rounded-3xl border border-white/10 shadow-xl"
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Principal's <span className="text-pink-400">Message</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            “Our fest is not just an event — it is a celebration of passion, teamwork, and excellence.
            I am proud of every student who contributes to making this festival unforgettable every year.”
          </p>
          <p className="text-pink-400 font-bold mt-4">– College Principal</p>
        </motion.div>

      </div>
    </section>
  );
};

export default PrincipalSection;
