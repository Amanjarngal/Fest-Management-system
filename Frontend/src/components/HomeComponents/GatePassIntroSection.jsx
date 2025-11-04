import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "Step 1: Visit the FestoMania Website",
    desc: "Go to our official Fest Website and navigate to the Gate Pass section.",
    img: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
  },
  {
    step: "Step 2: Fill Out Your Details",
    desc: "Provide accurate information like your Name, College, Roll No, Email, and Event Type (Attendee, Participant, or Contributor).",
    img: "https://lh3.googleusercontent.com/proxy/kdZfa9aBIhfvViubEvmcAlI5vs5w9iLJARryhLayRG7WuX5WABaBmnoMjV7vbmI1yr75cZP69MhHeJ4u5H3B0VXs12kY_jbhs1sH9YlNeD7cd1Q",
  },
  {
    step: "Step 3: Receive Your QR Entry Pass",
    desc: "After successful submission, you’ll receive a unique QR code containing your identity and access rights.",
    img: "https://www.hellotech.com/guide/wp-content/uploads/2020/05/HelloTech-qr-code-1024x1024.jpg",
  },
  {
    step: "Step 4: Save or Print Your QR",
    desc: "Take a screenshot or print your QR Code for a smooth entry experience at the gate.",
    img: "https://play-lh.googleusercontent.com/LJ5imEGeWpS0QYq-dDtSmlMcPohaAiZVXPffNrwC_iy1JgKJJxjnS2DhJ2L5q4pAuok=w480-h960-rw",
  },
  {
    step: "Step 5: Show QR to the Gate Guard",
    desc: "At the entry gate, show your QR code. The guard will scan it using our secure QR scanner for instant verification.",
    img: "https://stavecorp.com/wp-content/uploads/2021/03/1792-1.png",
  },
  {
    step: "Step 6: Access Granted!",
    desc: "Once your QR is validated, you can freely access fest zones, stalls, and activities — your pass is your identity!",
    img: "https://thumbs.dreamstime.com/b/access-granted-denied-stamp-stamps-set-44982540.jpg",
  },
];

const GatePassIntroSection = () => {
  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16 relative overflow-hidden">
      {/* Background Gradient Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
                <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
                <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
              </div>

      {/* Section Heading */}
      {/* Section Heading */}
<motion.div
  initial={{ opacity: 0, y: -30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="text-center mb-16 relative z-10"
>
  <p className="text-sm uppercase tracking-widest text-gray-400">// Step Guide</p>
  <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
    How to Join{" "}
    <span className="text-pink-500 italic">the Fest</span>
  </h2>
  <p className="text-gray-300 mt-4 text-base max-w-2xl mx-auto">
    Follow these simple steps to register, verify your GatePass, and enjoy 
    a seamless entry experience during the college fest!
  </p>
</motion.div>


     {/* Steps */}
{/* Steps */}
<div className="space-y-6 max-w-4xl mx-auto relative z-10">
  {steps.map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-center gap-5 bg-[#0D0D0D] hover:bg-[#1A102E] transition-all duration-300 p-5 rounded-xl border border-gray-800 hover:border-pink-500/40 shadow-md"
    >
      <img
        src={item.img}
        alt={item.step}
        className="w-14 h-14 object-contain flex-shrink-0"
      />
      <div>
        <h3 className="text-lg font-semibold text-pink-500 mb-1">
          {item.step}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  ))}
</div>


    </section>
  );
};

export default GatePassIntroSection;
