import React from "react";
import { Mic, Lightbulb, Network, Calendar, Users, GraduationCap } from "lucide-react";

const features = [
  {
    icon: <Mic size={28} />,
    title: "World Class Speakers",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Best Experience",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
  {
    icon: <Network size={28} />,
    title: "Networking",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
  {
    icon: <Calendar size={28} />,
    title: "Modern Venue",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
  {
    icon: <Users size={28} />,
    title: "New People",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
  {
    icon: <GraduationCap size={28} />,
    title: "Certificates",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-16">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-widest text-purple-400 font-semibold">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold mt-2 leading-snug">
          Why Should You Join <br /> Our Event
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-pink-600 rounded-full p-4 text-white">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
