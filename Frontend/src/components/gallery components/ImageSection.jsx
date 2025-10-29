import React, { useEffect, useState } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

const ImageSection = () => {
  const [images, setImages] = useState([]);

  // Fetch images from backend
  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images");
      setImages(res.data.images || []); // assuming backend returns { images: [...] }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Animation variants for variety
  const variants = [
    { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
    { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
    { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
  ];

  return (
    <section className="min-h-screen bg-[#000000] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
         Moments of Magic
        </h2>

        {images.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {images.map((item, index) => {
              const randomHeight = [250, 300, 350, 400, 450][index % 5]; // varied heights
              const anim = variants[index % variants.length];

              return (
                <motion.div
                  key={item._id || index}
                  className="relative mb-4 rounded-2xl overflow-hidden bg-gray-900 shadow-lg cursor-pointer group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  variants={anim}
                >
                  <div
                    className="w-full overflow-hidden bg-gray-800"
                    style={{ height: `${randomHeight}px` }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Event"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 rounded-2xl">
                    <p className="text-sm text-purple-400 mb-1">
                      {item.tags?.join(", ")}
                    </p>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-500 rounded-2xl" />
                </motion.div>
              );
            })}
          </Masonry>
        ) : (
          <p className="text-center text-gray-400 py-20">
            No images available.
          </p>
        )}
      </div>
    </section>
  );
};

export default ImageSection;
