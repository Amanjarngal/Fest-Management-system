import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "Do we need an entry pass for the fest?",
    answer:
      "Yes, all students must carry a valid entry pass or QR code generated during registration. Without it, entry will not be allowed."
  },
  {
    question: "Can students from other colleges attend the fest?",
    answer:
      "Yes, but they must register in advance and bring their college ID along with the entry pass."
  },
  {
    question: "What are the timings for the fest?",
    answer:
      "The fest starts at 10:00 AM and continues till 7:00 PM. Students should reach early to avoid long queues."
  },
  {
    question: "Where will the fest take place?",
    answer:
      "The fest will be held at the AGC Main Ground. You can view the exact location in the map section above."
  },
  {
    question: "How can I participate in events or competitions?",
    answer:
      "You must fill out the online registration form and select the events you wish to participate in. A confirmation QR code will be sent to your email."
  },
  {
    question: "Is food available inside the fest?",
    answer:
      "Yes! There will be a variety of food stalls including snacks, beverages, desserts, and special festive items."
  },
  {
    question: "Are we allowed to bring friends or family members?",
    answer:
      "Yes, visitors are allowed but they must also register and carry a valid entry pass."
  },
  {
    question: "Is parking available?",
    answer:
      "Yes, limited parking is available inside the campus. We recommend arriving early as spots fill up quickly."
  },
  {
    question: "Do I need to bring my college ID?",
    answer:
      "Yes, college ID is mandatory for entry even if you already have the entry pass."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-28 bg-black text-white relative overflow-hidden">

       {/* Background glows */}
      <div className="absolute w-[25rem] h-[25rem] bg-pink-600/10 blur-[150px] -top-10 left-10"></div>
      <div className="absolute w-[25rem] h-[25rem] bg-purple-700/10 blur-[150px] bottom-0 right-10"></div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-6xl font-extrabold mb-6"
      >
        <span className="text-pink-400">FAQ</span> – Students Ask
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-center text-gray-300 text-lg max-w-2xl mx-auto mb-16 px-6"
      >
        Here are some of the most common questions students ask during the fest.  
        If you’re confused, this section will clear your doubts instantly!
      </motion.p>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-md
                       hover:border-pink-400/40 transition-all shadow-lg"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-xl font-semibold text-white">
                {item.question}
              </span>

              <ChevronDown
                className={`text-pink-400 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-gray-300 leading-relaxed"
              >
                {item.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
