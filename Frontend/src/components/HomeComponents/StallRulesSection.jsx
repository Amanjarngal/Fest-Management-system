import React from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ShoppingBag,
  CreditCard,
  Receipt,
  Store,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <QrCode size={26} />,
    title: "Scan QR Code at Counter",
    desc: "Head to any stall counter and scan the displayed QR code. It instantly opens the menu section for that specific stall.",
  },
  {
    icon: <Store size={26} />,
    title: "Explore Stall Menu",
    desc: "View all the available items, prices, and special combos offered by that stall — all in one place.",
  },
  {
    icon: <ShoppingBag size={26} />,
    title: "Add to Cart",
    desc: "Select your favorite dishes or snacks and add them to your cart for a quick checkout.",
  },
  {
    icon: <CreditCard size={26} />,
    title: "Make Payment",
    desc: "Complete the purchase using the secure online payment system. Fast and hassle-free!",
  },
  {
    icon: <Receipt size={26} />,
    title: "Get Token Number",
    desc: "Once payment is successful, a unique token number will be generated — this acts as your order ID.",
  },
  {
    icon: <CheckCircle size={26} />,
    title: "Collect Your Order",
    desc: "Visit the stall counter, show your token number, and collect your freshly prepared order.",
  },
];

const StallOrderFlow = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <p className="text-sm uppercase tracking-widest text-gray-400">// Stall Purchase Process</p>
        <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
          Easy & Fast{" "}
          <span className="text-pink-500 italic">Ordering Experience</span>
        </h2>
        <p className="text-gray-300 mt-4 text-base max-w-2xl mx-auto">
          Simply scan, order, and collect! Our smart QR-based ordering system makes it 
          effortless to purchase from any stall during the fest.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 max-w-7xl mx-auto relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#100A25] hover:bg-[#1a0e3a] transition-all duration-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-pink-500/20"
          >
            <div className="flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 w-14 h-14 rounded-full mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-12 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(236,72,153,0.4)" }}
          onClick={() => navigate("/stalls")}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/40 transition-all duration-300 flex items-center gap-3"
        >
          <ArrowRight size={20} /> Explore Stalls
        </motion.button>
      </div>
    </section>
  );
};

export default StallOrderFlow;
