import React from 'react'
import HeroSection from '../components/HomeComponents/HeroSection'
import FeaturesSection from '../components/HomeComponents/FeaturesSection'
import MagicBanner from '../components/HomeComponents/MagicBanner'
import GallerySection from '../components/HomeComponents/GallerySection'
import EventHeroSection from '../components/HomeComponents/EventHeroSection'
import VotingIntroSection from '../components/HomeComponents/VotingIntroSection'
import GatePassIntroSection from '../components/HomeComponents/GatePassIntroSection'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <MagicBanner />
      <EventHeroSection />
      <GallerySection/>
      <VotingIntroSection />
      <GatePassIntroSection />
    </div>
  )
}

export default Home
