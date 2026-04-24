import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";
import type { PageableResponse } from "../types/pagination";

const categoryColors: Record<string, string> = {
  MUSIC: "from-purple-600 to-yellow-500",
  SPORTS: "from-green-600 to-yellow-500",
  FOOD: "from-pink-600 to-yellow-500",
  ART: "from-teal-600 to-yellow-500",
  EDUCATION: "from-blue-600 to-yellow-500",
  OTHER: "from-gray-600 to-yellow-500",
};

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch events untuk carousel
  const { data: eventsData, isPending } = useQuery({
    queryKey: ["hero-carousel"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>("/events", {
        params: { page: 1, take: 8 },
      });
      return data.data;
    },
  });

  const events = eventsData || [];

  // Auto-slide effect
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [events.length]);

  if (isPending || events.length === 0) {
    return (
      <section className="w-full pt-20 pb-12 h-64 sm:h-80 lg:h-96 px-4 sm:px-6 lg:px-8">
        <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg lg:rounded-2xl animate-pulse" />
      </section>
    );
  }

  const event = events[currentSlide];
  const gradient = categoryColors[event.category] || categoryColors.OTHER;

  return (
    <section className="relative w-full overflow-hidden pt-20">
      {/* Carousel Container */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full mx-auto rounded-lg lg:rounded-2xl overflow-hidden">
        {/* Slides */}
        {events.map((e, index) => {
          const isActive = index === currentSlide;
          const eventGradient = categoryColors[e.category] || categoryColors.OTHER;
          return (
            <Link
              key={e.id}
              to={`/event/${e.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer group ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background Image */}
              <div className={`absolute inset-0 bg-gradient-to-br ${eventGradient}`}>
                {e.imageUrl && (
                  <img
                    src={e.imageUrl}
                    alt={e.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "h-3 w-8 sm:h-4 sm:w-10 bg-yellow-400"
                : "h-3 w-3 sm:h-4 sm:w-4 bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;