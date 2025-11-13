import { motion } from "framer-motion";

const ContactMapSection = () => {
  return (
    <section className="relative bg-black py-24 text-white overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6"
      >
        Find <span className="text-pink-400">Us</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-14 px-6 leading-normal"
      >
        Join the event as soon as possible — this exact location will help you reach
        the venue on time. Our team is ready to welcome you! 🎉
      </motion.p>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-xl"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d680.4160917420206!2d74.99050206244813!3d31.577883725504384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391bd70060af2a23%3A0xeae01a78cdfc6c52!2sAGC%20Main%20Ground!5e0!3m2!1sen!2sin!4v1736892464964!5m2!1sen!2sin"
          height="400"
          className="w-full"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>
    </section>
  );
};

export default ContactMapSection;
