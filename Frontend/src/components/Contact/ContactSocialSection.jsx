import { Facebook, Instagram, Linkedin } from "lucide-react";

const ContactSocialSection = () => {
  return (
    <section className="py-16 bg-black text-white text-center">
      <h2 className="text-5xl font-bold mb-8">
        Follow <span className="text-pink-400">Us</span>
      </h2>

      <div className="flex justify-center gap-6">
        <div className="p-4 bg-white/10 rounded-full hover:bg-pink-500/20 transition">
          <Facebook size={28} className="text-pink-400" />
        </div>
        <div className="p-4 bg-white/10 rounded-full hover:bg-pink-500/20 transition">
          <Instagram size={28} className="text-pink-400" />
        </div>
        <div className="p-4 bg-white/10 rounded-full hover:bg-pink-500/20 transition">
          <Linkedin size={28} className="text-pink-400" />
        </div>
      </div>
    </section>
  );
};

export default ContactSocialSection;
