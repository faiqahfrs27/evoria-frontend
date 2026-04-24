import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";
import { Star, Users, TrendingUp, Music, Dumbbell, Utensils, Palette, BookOpen, MoreHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";
import type { PageableResponse } from "../types/pagination";

function Home() {
  const [page, setPage] = useState(1);

  const { data: events, isPending, error, refetch } = useQuery({
    queryKey: ["events", page],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>("/events", {
        params: { page, take: 6 },
      });
      return data;
    },
  });

  const categories = [
    { name: "Music", icon: Music },
    { name: "Sports", icon: Dumbbell },
    { name: "Food", icon: Utensils },
    { name: "Art", icon: Palette },
    { name: "Education", icon: BookOpen },
    { name: "Other", icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="w-full pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">Welcome to Evoria</p>
          <h1 className="mb-4 text-5xl font-bold sm:text-6xl lg:text-7xl">Discover the</h1>
          <h2 className="mb-8 bg-gradient-to-r from-yellow-400 via-purple-400 to-teal-400 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
            Extraordinary
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-base text-gray-300 sm:text-lg">
            Embark on a journey through celestial workshops, cosmic music, and mystical art galleries. Experience events that transcend the ordinary.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/events"
              className="rounded bg-yellow-400 px-8 py-3 font-bold text-black transition-colors hover:bg-yellow-300"
            >
              Explore Events
            </Link>
            <button className="rounded border-2 border-yellow-400 px-8 py-3 font-bold text-yellow-400 transition-colors hover:bg-yellow-400/10">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="w-full border-y border-yellow-400/20 bg-slate-900/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/events?category=${cat.name.toLowerCase()}`}
                  className="group"
                >
                  <div className="rounded border border-yellow-400/40 p-5 text-center transition-all hover:border-yellow-400 hover:bg-yellow-400/5">
                    <IconComponent size={36} className="mx-auto mb-3 text-yellow-400/70 transition-colors group-hover:text-yellow-400" />
                    <p className="text-sm font-semibold text-white transition-colors group-hover:text-yellow-300">
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
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Upcoming Experiences</h2>
            <Link to="/events" className="whitespace-nowrap font-bold text-yellow-400 transition-colors hover:text-yellow-300">
              View all →
            </Link>
          </div>

          {error && (
            <div className="mb-8 flex items-center justify-between rounded border border-red-700/50 bg-red-950/50 p-4 text-red-400">
              <span>Failed to load events</span>
              <button onClick={() => refetch()} className="text-red-300 underline hover:text-red-200">
                Retry
              </button>
            </div>
          )}

          {isPending ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events?.data.length === 0 ? (
            <div className="py-16 text-center text-gray-400">No events available</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events?.data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* JOIN ORGANIZER SECTION */}
      <section className="w-full border-y border-yellow-400/20 bg-gradient-to-r from-purple-900/30 via-slate-900 to-teal-900/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Ready to Share Your Vision?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-gray-300 leading-relaxed sm:text-lg">
            Join our community of event organizers and creators. Bring your extraordinary ideas to life.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <Star className="mb-3 mx-auto text-yellow-400" size={28} />
              <h3 className="mb-2 font-bold">Premium Reach</h3>
              <p className="text-sm text-gray-400">Access to thousands of event seekers</p>
            </div>
            <div>
              <Users className="mb-3 mx-auto text-yellow-400" size={28} />
              <h3 className="mb-2 font-bold">Community Support</h3>
              <p className="text-sm text-gray-400">Connect with other organizers</p>
            </div>
            <div>
              <TrendingUp className="mb-3 mx-auto text-yellow-400" size={28} />
              <h3 className="mb-2 font-bold">Grow Your Brand</h3>
              <p className="text-sm text-gray-400">Build and scale your events</p>
            </div>
          </div>

          <Link
            to="/register?role=organizer"
            className="inline-block rounded bg-yellow-400 px-8 py-3 font-bold text-black transition-colors hover:bg-yellow-300"
          >
            Become an Organizer
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-yellow-400/20 bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-yellow-400">
                  <div className="h-5 w-5 rounded-full bg-yellow-400"></div>
                </div>
                <span className="font-bold">EVORIA</span>
              </div>
              <p className="text-xs text-gray-400">Discover extraordinary events</p>
            </div>

            <div>
              <h4 className="mb-3 font-bold">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/events" className="transition-colors hover:text-yellow-400">
                    All Events
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="transition-colors hover:text-yellow-400">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-bold">For Organizers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/register?role=organizer"
                    className="transition-colors hover:text-yellow-400"
                  >
                    Create Event
                  </Link>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-yellow-400">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-yellow-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-yellow-400">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-yellow-400/20 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Evoria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;