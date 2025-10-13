import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageSection from "../components/gallery components/ImageSection";
import HeroSection from "../components/gallery components/HeroSection";
import JoinEventSection from "../components/gallery components/JoinEventSection";

const Gallery = () => {
  
  return (
   <>
   <HeroSection/>
   <ImageSection />
   <JoinEventSection/>
   </>
  );
};

export default Gallery;