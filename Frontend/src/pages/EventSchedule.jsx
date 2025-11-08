import React from 'react'
import {useEffect} from "react"
import EventHero from '../components/Event Comp/EventHero'
import EventsSection from '../components/Event Comp/EventsSection'

const EventSchedule = () => {
  
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // or "auto" if you want instant scroll
      });
    }, []);
  return (
    <div>
      <EventHero />
      <EventsSection />
    </div>
  )
}

export default EventSchedule
