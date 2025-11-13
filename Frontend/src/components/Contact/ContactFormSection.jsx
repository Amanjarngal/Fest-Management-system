import { motion } from "framer-motion";

const ContactFormSection = () => {
  return (
    <section className="py-28 bg-black text-white relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-center mb-4"
        >
          Send Us a <span className="text-pink-400">Message</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-gray-300 text-lg max-w-2xl mx-auto mb-12"
        >
          If you have any questions, doubts, or need assistance, feel free to reach out.  
          Our team will get back to you as soon as possible! 💬
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 p-10 rounded-2xl shadow-lg backdrop-blur-md border border-white/10"
        >

          {/* Name + Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none"
            />

            <select
              className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none"
            >
              <option value="">Select Reason</option>
              <option value="general">General Inquiry</option>
              <option value="event">Event Related</option>
              <option value="technical">Technical Issue</option>
              <option value="feedback">Feedback / Suggestion</option>
            </select>
          </div>

          {/* Subject */}
          <input
            type="text"
            placeholder="Subject"
            className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none w-full mt-6"
          />

          {/* Event Name */}
          <input
            type="text"
            placeholder="Event Name (Optional)"
            className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none w-full mt-6"
          />

          {/* Message */}
          <textarea
            rows="5"
            placeholder="Your Message"
            className="p-4 rounded-xl bg-black/40 border border-white/20 focus:border-pink-500 outline-none w-full mt-6"
          ></textarea>

          {/* File Upload */}
          <div className="mt-6">
            <label className="block text-gray-300 mb-2">Attach File (Optional)</label>
            <input
              type="file"
              className="p-3 w-full rounded-xl bg-black/40 border border-white/20 text-gray-300 cursor-pointer"
            />
          </div>

          {/* Button */}
          <button className="w-full mt-10 py-4 rounded-xl btn-gradient transition-all font-semibold text-lg shadow-lg shadow-pink-500/30">
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactFormSection;
