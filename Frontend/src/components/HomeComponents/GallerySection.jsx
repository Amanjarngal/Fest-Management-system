import React from "react";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router-dom";

const galleryImages = [
  {
    id: 1,
    src: "https://media.istockphoto.com/id/1478375497/photo/friends-dancing-at-the-festival.jpg?s=612x612&w=0&k=20&c=rVwFBKe__UuQld6kJUWjV48kyw-40OHlnuyQZd4_lgQ=",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 2,
    src: "https://images.cnbctv18.com/wp-content/uploads/2023/03/IIT-Kanpur-Fest.jpg?impolicy=website&width=1200&height=900",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 3,
    src: "https://www.bennett.edu.in/wp-content/uploads/2024/05/Bennett-University-Cultural-Fest-Uphoria-2024-Unfolded-its-vibrant-canvas.jpg",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 4,
    src: "https://www.posist.com/restaurant-times/wp-content/uploads/2019/12/grub-fest.jpg",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 5,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1_-CtaHKfJ4P5lrBXGx0OmVKg5EwqQKovg&s",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 6,
    src: "https://media.assettype.com/pudhari%2Fimport%2Fwp-content%2Fuploads%2F2024%2F02%2Farijit.jpg?w=480&auto=format%2Ccompress&fit=max",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 7,
    src: "https://www.livemint.com/lm-img/img/2025/03/11/original/gunsnroses_1741688059360.jpeg",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
  {
    id: 8,
    src: "https://t3.ftcdn.net/jpg/06/46/40/40/360_F_646404057_dZp9m50EsdwskSbfLRz0g2TbyiDo6IUy.jpg",
    artist: "Audrey Podshiwaite",
    location: "Blue Banana Vista",
  },
];

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

// Animation variants for smooth entry
const variants = [
  { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
];

const GallerySection = () => {
    const navigate = useNavigate();
  return (
    <section className="bg-[#000000] text-white py-20 px-6 md:px-20 relative overflow-hidden">
        {/* Glowing background light effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-64 h-64 bg-purple-600/20 blur-[120px] top-10 left-10 animate-pulse" />
                <div className="absolute w-80 h-80 bg-pink-500/20 blur-[150px] bottom-10 right-10 animate-pulse" />
              </div>
        
              {/* Section Heading */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12 relative z-10"
              ></motion.div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-400">// Latest Gallery</p>
          <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
            Memories of Last{" "}
            <span className="text-pink-500 italic">Year</span>
          </h2>
        </div>

        <motion.button
           onClick={() => navigate("/gallery")} 
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168,85,247,0.5)" }}
          className="btn-gradient px-7 py-3 text-base flex items-center space-x-2"
        >
          ⬈ See More Gallery
        </motion.button>
      </div>

      {/* Masonry Gallery Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {galleryImages.map((img, index) => {
          const randomHeight = [260, 320, 380, 420][index % 4];
          const anim = variants[index % variants.length];

          return (
            <motion.div
              key={img.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              variants={anim}
              className="relative mb-4 rounded-2xl overflow-hidden bg-gray-900 shadow-lg cursor-pointer group"
            >
              {/* Image */}
              <div
                className="w-full overflow-hidden bg-gray-800"
                style={{ height: `${randomHeight}px` }}
              >
                <img
                  src={img.src}
                  alt="Event memory"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 rounded-2xl">
                <p className="text-sm text-purple-400 mb-1">
                  ◆ {img.location}
                </p>
                <h3 className="text-lg font-semibold">{img.artist}</h3>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-500 rounded-2xl" />
            </motion.div>
          );
        })}
      </Masonry>
    </section>
  );
};

export default GallerySection;
