import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Music, Dumbbell, Utensils, Palette, BookOpen, MoreHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";
import type { PageableResponse } from "../types/pagination";

function Home() {
  const { data: events, isPending, error, refetch } = useQuery({
    queryKey: ["events", 1],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>("/events", {
        params: { page: 1, take: 6 },
      });
      return data;
    },
  });

  const categories = [
    { name: "Music", value: "music", icon: Music },
    { name: "Sports", value: "sports", icon: Dumbbell },
    { name: "Food", value: "food", icon: Utensils },
    { name: "Art", value: "art", icon: Palette },
    { name: "Education", value: "education", icon: BookOpen },
    { name: "Other", value: "other", icon: MoreHorizontal },
  ];

  return (
    <div className="evoria-shell min-h-screen text-[#F9F3E8]">
      <Navbar />

      {/* HERO SECTION WITH CAROUSEL */}
      <HeroCarousel />

      {/* CATEGORIES SECTION */}
      <section className="w-full border-y border-[rgba(212,169,74,0.14)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12 text-center">
            <h2 className="evoria-section-title text-4xl sm:text-5xl lg:text-6xl">
              Explore <span className="text-shimmer">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link key={cat.name} to={`/events?category=${cat.value}`} className="group">
                  <div className="evoria-card rounded-[1rem] p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[rgba(212,169,74,0.46)] hover:bg-[rgba(212,169,74,0.045)]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(212,169,74,0.24)] bg-[rgba(212,169,74,0.045)] transition group-hover:border-[#D4A94A]/60">
                      <IconComponent size={28} className="text-[#D4A94A] transition group-hover:scale-110" />
                    </div>
                    <p className="text-sm font-semibold text-[#F9F3E8] transition group-hover:text-[#E8C97A]">
                      {cat.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="w-full px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[1152px]">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <h2 className="evoria-section-title text-4xl sm:text-5xl lg:text-6xl">
                Upcoming Events
              </h2>
            </div>
            <Link to="/events" className="hidden text-sm font-semibold text-[#D4A94A] transition hover:text-[#F5DFA0] sm:block">
              View all →
            </Link>
          </div>

          {error && (
            <div className="mb-8 flex items-center justify-between rounded-[0.9rem] border border-red-500/35 bg-red-950/30 p-4 text-sm text-red-200">
              <span>Failed to load events</span>
              <button onClick={() => refetch()} className="text-red-100 underline-offset-4 hover:underline">
                Retry
              </button>
            </div>
          )}

          {isPending ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <EventCardSkeleton key={item} />
              ))}
            </div>
          ) : events?.data.length === 0 ? (
            <div className="evoria-card rounded-[1.1rem] py-16 text-center text-sm text-[#8A8A9A]">
              No events available
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events?.data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <Link to="/events" className="mt-8 block text-center text-sm font-semibold text-[#D4A94A] transition hover:text-[#F5DFA0] sm:hidden">
            View all →
          </Link>
        </div>
      </section>

      {/* JOIN ORGANIZER SECTION */}
      <section className="w-full border-y border-[rgba(212,169,74,0.14)] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-[900px] overflow-hidden rounded-[1.35rem] border border-[rgba(212,169,74,0.18)] bg-[radial-gradient(circle_at_20%_20%,rgba(212,169,74,0.13),transparent_30%),linear-gradient(135deg,rgba(28,28,34,0.92),rgba(13,13,15,0.94))] px-6 py-16 text-center shadow-[0_34px_90px_rgba(0,0,0,0.38)] sm:px-12">
          <h2 className="evoria-section-title mb-4 text-4xl sm:text-5xl lg:text-6xl">
            Ready to Share Your Vision?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-[#B9B1A5] sm:text-base">
            Create and manage your own events. Join thousands of organizers building incredible experiences.
          </p>

          <Link to="/register/organizer" className="evoria-gold-button inline-block rounded-sm px-9 py-3 text-sm font-bold tracking-[0.08em] transition hover:brightness-110">
            Become an Organizer
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#14141A]/70 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-[1152px]">
          <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.75)]">
                  <div className="h-3 w-3 rounded-full bg-[#D4A94A]" />
                </div>
                <span className="text-sm font-semibold tracking-[0.16em] text-[#F9F3E8]">EVORIA</span>
              </div>
              <p className="text-xs text-[#8A8A9A]">Discover extraordinary events</p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#F9F3E8]">Explore</h4>
              <ul className="space-y-3 text-sm text-[#8A8A9A]">
                <li><Link to="/events" className="transition hover:text-[#D4A94A]">All Events</Link></li>
                <li><Link to="/events" className="transition hover:text-[#D4A94A]">Categories</Link></li>
              </ul>
            </div>


            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#F9F3E8]">Evoria Support</h4>
              <ul className="space-y-3 text-sm text-[#8A8A9A]">
                <li><a href="#" className="transition hover:text-[#D4A94A]">E-mail : help@evoria.id</a></li>
                <li><a href="#" className="transition hover:text-[#D4A94A]">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgba(212,169,74,0.14)] pt-8 text-center text-xs text-[#6F6F7D]">
            <p>&copy; 2026 Evoria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
