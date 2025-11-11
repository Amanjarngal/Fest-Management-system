import React from 'react'
import HeroSection from '../components/HomeComponents/HeroSection'
import FeaturesSection from '../components/HomeComponents/FeaturesSection'
import MagicBanner from '../components/HomeComponents/MagicBanner'
import GallerySection from '../components/HomeComponents/GallerySection'
import EventHeroSection from '../components/HomeComponents/EventHeroSection'
import VotingIntroSection from '../components/HomeComponents/VotingIntroSection'
// import GatePassIntroSection from '../components/HomeComponents/GatePassIntroSection'
import ConcertPerformers from '../components/HomeComponents/ConcertPerformers'
import Sponsors from '../components/HomeComponents/Sponsors'
import Testimonials from '../components/HomeComponents/Testimonials'
import FeedbackForm from '../components/HomeComponents/FeedbackForm'
import StallRulesSection from '../components/HomeComponents/StallRulesSection'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <MagicBanner />
      <EventHeroSection />
      <ConcertPerformers />
      <GallerySection/>
      <VotingIntroSection />
      <StallRulesSection />
      {/* <GatePassIntroSection /> */}
      <Sponsors />
      <Testimonials />
      <FeedbackForm />
    </div>
  )
}

export default Home
