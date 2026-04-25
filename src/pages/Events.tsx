import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";
import type { PageableResponse } from "../types/pagination";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Music", value: "MUSIC" },
  { label: "Sports", value: "SPORTS" },
  { label: "Food", value: "FOOD" },
  { label: "Art", value: "ART" },
  { label: "Education", value: "EDUCATION" },
  { label: "Other", value: "OTHER" },
];

const locations = [
  { label: "All Locations", value: "" },
  { label: "Jakarta", value: "Jakarta" },
  { label: "Bandung", value: "Bandung" },
  { label: "Surabaya", value: "Surabaya" },
  { label: "Bali", value: "Bali" },
  { label: "Yogyakarta", value: "Yogyakarta" },
];

function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";

  const [searchInput, setSearchInput] = useState(search);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["events-page", page, search, category, location],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>(
        "/events",
        {
          params: {
            page,
            take: 8,
            search: search || undefined,
            category: category || undefined,
            location: location || undefined,
          },
        },
      );

      return data;
    },
  });

  const totalPage = data?.meta?.total
    ? Math.ceil(data.meta.total / data.meta.take)
    : 1;

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(targetPage));
    setSearchParams(params);
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (searchInput === search) return;

    const timer = setTimeout(() => {
      updateParam("search", searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
      <Navbar />

      <main className="mx-auto max-w-[1152px] px-6 pb-20 pt-28 lg:px-8">
        <div className="mb-10 flex flex-col gap-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4A94A]">
                Explore
              </p>
              <h1 className="text-5xl font-light tracking-[-0.04em] sm:text-6xl">
                All Events
              </h1>
            </div>

            <Link
              to="/"
              className="hidden text-sm font-semibold text-[#D4A94A] transition hover:text-[#F5DFA0] sm:block"
            >
              Back home →
            </Link>
          </div>

          <div className="grid gap-3 rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/60 p-4 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/70"
              />

              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search event"
                className="h-11 w-full rounded-sm border border-[rgba(212,169,74,0.24)] bg-[#0D0D0F] pl-10 pr-3 text-sm text-[#F9F3E8] outline-none placeholder:text-[#6F6F7D] focus:border-[#D4A94A]/70"
              />
            </div>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => updateParam("category", e.target.value)}
                className="h-11 w-full appearance-none rounded-sm border border-[rgba(212,169,74,0.24)] bg-[#0D0D0F] px-3 pr-10 text-sm text-[#F9F3E8] outline-none focus:border-[#D4A94A]/70"
              >
                {categories.map((cat) => (
                  <option key={cat.label} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/80"
              />
            </div>

            <div className="relative">
              <select
                value={location}
                onChange={(e) => updateParam("location", e.target.value)}
                className="h-11 w-full appearance-none rounded-sm border border-[rgba(212,169,74,0.24)] bg-[#0D0D0F] px-3 pr-10 text-sm text-[#F9F3E8] outline-none focus:border-[#D4A94A]/70"
              >
                {locations.map((loc) => (
                  <option key={loc.label} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/80"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center justify-between rounded-[0.9rem] border border-red-500/35 bg-red-950/30 p-4 text-sm text-red-200">
            <span>Failed to load events.</span>
            <button
              onClick={() => refetch()}
              className="text-red-100 underline-offset-4 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <EventCardSkeleton key={item} />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 py-20 text-center text-sm text-[#8A8A9A]">
            No events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data?.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-end gap-2">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="flex h-10 items-center gap-1 rounded-sm border border-[rgba(212,169,74,0.2)] px-3 text-sm text-[#F9F3E8] transition hover:border-[#D4A94A]/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          <span className="flex h-10 min-w-10 items-center justify-center rounded-sm border border-[rgba(212,169,74,0.28)] bg-[rgba(212,169,74,0.08)] px-3 text-sm text-[#D4A94A]">
            {page}
          </span>

          <button
            disabled={page >= totalPage}
            onClick={() => goToPage(page + 1)}
            className="flex h-10 items-center gap-1 rounded-sm border border-[rgba(212,169,74,0.2)] px-3 text-sm text-[#F9F3E8] transition hover:border-[#D4A94A]/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default Events;