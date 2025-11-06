import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageSection from "../components/gallery components/ImageSection";
import HeroSection from "../components/gallery components/HeroSection";
import ShareMoment from "../components/gallery components/ShareMoment";


const Gallery = () => {
  
  return (
   <>
   <HeroSection/>
   <ImageSection />
   <ShareMoment />
   </>
  );
};

export default Gallery;