import React from "react";
import { motion } from "framer-motion";
import { QrCode, ShoppingCart, Wallet, ShieldCheck, Info } from "lucide-react";

const stallRules = [
  {
    icon: <QrCode className="text-pink-400 w-7 h-7" />,
    title: "Scan Stall QR",
    description:
      "Each stall has a unique QR code. Scan it using the 'Scan Stall QR' button or your camera to instantly open the stall’s page and view their menu.",
  },
  {
    icon: <ShoppingCart className="text-purple-400 w-7 h-7" />,
    title: "Add Items to Cart",
    description:
      "Browse through the stall’s menu and add your favorite items to your cart. You can review or edit your selections anytime before checkout.",
  },
  {
    icon: <Wallet className="text-pink-400 w-7 h-7" />,
    title: "Make Payment & Generate Token",
    description:
      "After finalizing your cart, proceed to payment. Once your payment is successfully completed, the system will automatically generate a unique digital token for your order.",
  },
  {
    icon: <ShieldCheck className="text-purple-400 w-7 h-7" />,
    title: "Secure Ordering",
    description:
      "Every token is securely linked to your verified account. Tokens cannot be reused or shared, ensuring complete safety and authenticity for all transactions.",
  },
  {
    icon: <Info className="text-pink-400 w-7 h-7" />,
    title: "Collect from Stall",
    description:
      "Show your digital token to the stall representative to collect your items. Please confirm your order details before leaving the counter.",
  },
  {
    icon: <ShieldCheck className="text-purple-400 w-7 h-7" />,
    title: "Fair Usage Policy",
    description:
      "Each token is valid for a single order only. Any duplication, misuse, or unauthorized sharing will result in automatic cancellation of the order.",
  },
];


const StallRulesSection = () => {
  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-500/20 blur-[140px] top-10 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-purple-600/20 blur-[150px] bottom-10 right-10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-white bg-clip-text text-transparent "
        >
          Stall System <span className="text-pink-500">Guidelines ⚡</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Follow these simple steps to explore stalls, add your items, and collect your orders smoothly during the fest.
        </motion.p>

        {/* Rules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          {stallRules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-pink-500/20 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                {rule.icon}
                <h3 className="text-xl font-semibold text-white">
                  {rule.title}
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StallRulesSection;
