import React from 'react'
import AboutHeroSection from '../components/About/AboutHeroSection'
import AboutDescriptionSection from '../components/About/AboutDescriptionSection'
import PreviousEventsSection from '../components/About/PreviousEventsSection'
import PrincipalSection from '../components/About/PrincipalSection'
import OrganizersSection from '../components/About/OrganizersSection'
import TeamLeadersSection from '../components/About/TeamLeadersSection'

const About = () => {
  return (
    <div>
      <AboutHeroSection />
      <AboutDescriptionSection />
      <PreviousEventsSection />
      <PrincipalSection />
      <OrganizersSection />
      <TeamLeadersSection />
    </div>
  )
}

export default About
