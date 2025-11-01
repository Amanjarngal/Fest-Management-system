import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const EventSchedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 100 });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/api/events`);
      setEvents(res.data);
      setSelectedDay(res.data[0]?.day);
    } catch (err) {
      console.error(err);
    }
  };

  const groupedByDay = events.reduce((acc, event) => {
    acc[event.day] = acc[event.day] || [];
    acc[event.day].push(event);
    return acc;
  }, {});

  return (
    <section className="bg-[#050512] text-white py-20 relative overflow-hidden">
      {/* Subtle Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-pink-900/10 blur-3xl"></div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <p className="text-pink-400 tracking-widest uppercase text-sm">
          // Event Schedule
        </p>
        <h2 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
          Follow Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Event Schedule</span>
        </h2>
      </div>

      {/* Day Tabs */}
      <div className="flex justify-center flex-wrap gap-5 mb-20 relative z-10">
        {Object.keys(groupedByDay).map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(day)}
            className={`relative rounded-full px-10 py-5 text-lg font-semibold transition-all duration-300 shadow-md ${
              selectedDay === day
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_25px_rgba(216,0,255,0.5)]"
                : "bg-[#12122a] text-gray-300 hover:text-white hover:bg-[#1c1c3a]"
            }`}
          >
            <div className="flex flex-col items-center">
              <span>
                Day {i + 1}
              </span>
              <span
                className={`text-sm ${
                  selectedDay === day ? "text-gray-200" : "text-gray-500"
                }`}
              >
                {groupedByDay[day][0]?.date}
              </span>
            </div>

            {selectedDay === day && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-pink-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 z-10">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[3px] bg-gradient-to-b from-pink-500 via-purple-500 to-transparent opacity-60"></div>

        {groupedByDay[selectedDay]?.map((event, idx) => (
          <div
            key={event._id}
            data-aos={idx % 2 === 0 ? "fade-left" : "fade-right"}
            className={`mb-24 flex flex-col md:flex-row items-center gap-10 ${
              idx % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="md:w-1/2 relative group overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.25)]">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-72 md:h-80 object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            {/* Connector Dot */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-4 border-[#050512] z-10 shadow-[0_0_25px_rgba(216,0,255,0.8)] animate-pulse"></div>
            </div>

            {/* Text Content */}
            <div className="md:w-1/2 bg-[#0e0e26] rounded-3xl p-8 shadow-xl border border-purple-900/30 hover:border-pink-500/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                {event.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {event.description ||
                  "A memorable experience curated for inspiration, creativity, and innovation."}
              </p>

              <div className="flex flex-wrap gap-5 text-gray-300 text-sm mb-8">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-pink-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-pink-400" />
                  <span>{event.location}</span>
                </div>
              </div>

              <button className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(216,0,255,0.4)]">
                <span className="relative z-10">Buy Ticket</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
              </button>
            </div>
          </div>
        ))}

        {!groupedByDay[selectedDay]?.length && (
          <p className="text-center text-gray-400 text-lg mt-10">
            No events available for this day.
          </p>
        )}
      </div>
    </section>
  );
};

export default EventSchedule;
