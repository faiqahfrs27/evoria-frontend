import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";
import type { PageableResponse } from "../types/pagination";

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: eventsData, isPending } = useQuery({
    queryKey: ["hero-carousel"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>(
        "/events",
        {
          params: { page: 1, take: 8 },
        }
      );

      return data.data;
    },
  });

  const events = eventsData ?? [];

  useEffect(() => {
    if (events.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % events.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [events.length]);

  if (isPending || events.length === 0) {
    return (
      <section className="px-6 pb-14 pt-24 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative h-[255px] overflow-hidden rounded-[1.35rem] border border-[rgba(212,169,74,0.12)] bg-[#14141A] shadow-[0_30px_90px_rgba(0,0,0,0.38)] sm:h-[310px] lg:h-[340px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,169,74,0.10),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.035),transparent_28%)]" />
            <div className="absolute inset-x-10 bottom-10 h-px bg-gradient-to-r from-transparent via-[rgba(212,169,74,0.24)] to-transparent" />
          </div>
        </div>
      </section>
    );
  }

  const goToPrevious = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? events.length - 1 : previous - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((previous) =>
      previous === events.length - 1 ? 0 : previous + 1
    );
  };

  return (
    <section className="px-6 pb-14 pt-24 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative h-[255px] overflow-hidden rounded-[1.35rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A] shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:h-[310px] lg:h-[340px]">
          {events.map((event, index) => {
            const isActive = index === currentSlide;

            return (
              <Link
                key={event.id}
                to={`/events/${event.slug || event.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,169,74,0.22),transparent_28%),linear-gradient(135deg,#14141A,#0D0D0F)]" />
                )}
              </Link>
            );
          })}

          {events.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F9F3E8] text-[#0D0D0F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:bg-white"
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F9F3E8] text-[#0D0D0F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:bg-white"
                aria-label="Next slide"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {events.map((event, index) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-9 bg-[#D4A94A]"
                    : "w-4 bg-[#F9F3E8]/25 hover:bg-[#D4A94A]/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;