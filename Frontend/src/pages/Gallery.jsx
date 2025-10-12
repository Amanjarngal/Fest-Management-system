import React, { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);

  // Fetch images from backend
  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images");
      setImages(res.data.images); // assuming backend returns { images: [...] }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <section className="min-h-screen bg-[#0b0b12] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Event Gallery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.length > 0 ? (
            images.map((item) => (
              <div
                key={item._id}
                className="relative group rounded-2xl overflow-hidden shadow-xl hover:scale-[1.05] transition-transform duration-500 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title || "Event"}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 rounded-2xl">
                  <p className="text-sm text-purple-400 mb-1">{item.tags?.join(", ")}</p>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                </div>

                {/* Soft glow */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-500 rounded-2xl" />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400 py-20">
              No images available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
