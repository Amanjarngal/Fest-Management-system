import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const ContactInfoSection = () => {
  return (
    <section className="py-28 bg-black text-white relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl sm:text-6xl font-extrabold mb-6"
      >
        Get in <span className="text-pink-400">Touch</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-20 px-6"
      >
        Have a question, suggestion, or need help?  
        Our team is always ready to assist you — reach out anytime!
      </motion.p>

      {/* Card Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">

        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="p-10 bg-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)] 
                     backdrop-blur-md border border-white/10 
                     hover:border-pink-500 hover:shadow-[0_0_35px_rgba(236,72,153,0.4)] 
                     hover:bg-pink-500/10 transition-all duration-300 transform hover:-translate-y-2"
        >
          <Mail size={48} className="text-pink-400 mx-auto" />

          <h3 className="text-2xl font-bold text-center mt-5">Email Us</h3>
          <p className="text-gray-300 text-center mt-2">
            support@fest.com  
          </p>
          <p className="text-gray-400 text-center text-sm mt-2">
            We respond within 24 hours
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="p-10 bg-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)] 
                     backdrop-blur-md border border-white/10 
                     hover:border-purple-500 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] 
                     hover:bg-purple-500/10 transition-all duration-300 transform hover:-translate-y-2"
        >
          <Phone size={48} className="text-purple-400 mx-auto" />

          <h3 className="text-2xl font-bold text-center mt-5">Call Us</h3>
          <p className="text-gray-300 text-center mt-2">
            +91 98765 43210
          </p>
          <p className="text-gray-400 text-center text-sm mt-2">
            Available Mon–Sat (9AM–6PM)
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="p-10 bg-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)] 
                     backdrop-blur-md border border-white/10 
                     hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(250,204,21,0.4)] 
                     hover:bg-yellow-500/10 transition-all duration-300 transform hover:-translate-y-2"
        >
          <MapPin size={48} className="text-yellow-300 mx-auto" />

          <h3 className="text-2xl font-bold text-center mt-5">Our Address</h3>
          <p className="text-gray-300 text-center mt-2">
            Amritsar Group of Colleges, Punjab
          </p>
          <p className="text-gray-400 text-center text-sm mt-2">
            Visit us anytime during working hours
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactInfoSection;
