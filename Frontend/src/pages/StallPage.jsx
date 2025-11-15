import React, { useEffect } from 'react'
import StallsList from '../components/Stalls/StallsList'
import StallHeroSection from '../components/Stalls/StallHeroSection'
import StallRulesSection from '../components/Stalls/StallRulesSection'
import FeedbackForm from '../components/HomeComponents/FeedbackForm'

const StallPage = () => {
   // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <StallHeroSection/>
      <StallRulesSection />
      <StallsList />
      <FeedbackForm/>
    </>
  )
}

export default StallPage
