import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Star,
  User,
  MessageSquare,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";
import Footer from "../components/Footer";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={16}
          className={
            value <= Math.round(rating)
              ? "fill-[#D4A94A] text-[#D4A94A]"
              : "text-[#4A4038]"
          }
        />
      ))}
    </div>
  );
};

function OrganizerProfile() {
  const { organizerId } = useParams();

  const {
    data: profile,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizer-profile", organizerId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/reviews/organizer/${organizerId}`,
      );

      return data.data;
    },
    enabled: Boolean(organizerId),
    retry: false,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
          <div className="h-[280px] animate-pulse rounded-[1.1rem] bg-[#14141A]" />
          <div className="mt-5 h-[180px] animate-pulse rounded-[1.1rem] bg-[#14141A]" />
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
          <div className="rounded-[1.1rem] border border-red-500/30 bg-red-950/20 p-8 text-red-200">
            <p className="font-semibold">Organizer profile failed to load.</p>
            <p className="mt-2 text-sm text-red-200/80">
              Please check whether GET /reviews/organizer/:organizerId is
              already registered in your backend.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-sm border border-red-300/40 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const organizer = profile.organizer;
  const events = profile.events ?? [];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
      <Navbar />

      <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D4A94A] transition hover:text-[#F5DFA0]"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <section className="rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]">
                {organizer?.profilePic ? (
                  <img
                    src={organizer.profilePic}
                    alt={organizer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={34} className="text-[#D4A94A]" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A94A]">
                  Organizer Profile
                </p>

                <h1 className="mt-1 text-2xl font-bold text-[#F9F3E8]">
                  {organizer?.name || "Organizer"}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm text-[#B9B1A5]">
                  <Mail size={15} className="text-[#D4A94A]" />
                  <span>{organizer?.email || "-"}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/80 p-4">
                <p className="text-xs text-[#8A8A9A]">Average Rating</p>
                <p className="mt-1 text-2xl font-bold text-[#D4A94A]">
                  {profile.averageRating || 0}
                  <span className="text-sm text-[#B9B1A5]"> / 5</span>
                </p>
              </div>

              <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/80 p-4">
                <p className="text-xs text-[#8A8A9A]">Total Reviews</p>
                <p className="mt-1 text-2xl font-bold text-[#F9F3E8]">
                  {profile.totalReviews || 0}
                </p>
              </div>

              <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/80 p-4">
                <p className="text-xs text-[#8A8A9A]">Total Events</p>
                <p className="mt-1 text-2xl font-bold text-[#F9F3E8]">
                  {profile.totalEvents || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A94A]">
                Reviews
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Customer Reviews by Event
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-sm text-[#B9B1A5] sm:flex">
              {renderStars(profile.averageRating || 0)}
            </div>
          </div>

          {profile.totalReviews === 0 ? (
            <div className="mt-4 rounded-[1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 p-6">
              <div className="flex items-start gap-3">
                <MessageSquare size={22} className="text-[#D4A94A]" />
                <div>
                  <p className="font-semibold text-[#F9F3E8]">
                    No reviews yet
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#B9B1A5]">
                    Reviews will appear here after customers attend events and
                    submit their ratings.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              {events.map((event: any) => (
                <article
                  key={event.id}
                  className="rounded-[1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 p-5"
                >
                  <div className="flex flex-col gap-3 border-b border-[rgba(212,169,74,0.14)] pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#F9F3E8]">
                        {event.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-[#B9B1A5]">
                        <CalendarDays size={15} className="text-[#D4A94A]" />
                        <span>
                          {formatDate(event.startDate)} -{" "}
                          {formatDate(event.endDate)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[0.75rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/80 px-4 py-3">
                      <div className="flex items-center gap-2">
                        {renderStars(event.averageRating || 0)}
                      </div>
                      <p className="mt-1 text-xs text-[#8A8A9A]">
                        {event.averageRating || 0} / 5 from{" "}
                        {event.totalReviews || 0} review(s)
                      </p>
                    </div>
                  </div>

                  {event.reviews.length === 0 ? (
                    <p className="mt-4 text-sm text-[#8A8A9A]">
                      This event has no reviews yet.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {event.reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="rounded-[0.85rem] border border-[rgba(212,169,74,0.1)] bg-[#0D0D0F]/70 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#F9F3E8]">
                                {review.customer?.name || "Customer"}
                              </p>
                              <div className="mt-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>

                            <p className="text-xs text-[#8A8A9A]">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>

                          {review.comment ? (
                            <p className="mt-3 text-sm leading-6 text-[#B9B1A5]">
                              “{review.comment}”
                            </p>
                          ) : (
                            <p className="mt-3 text-sm italic text-[#8A8A9A]">
                              No written comment.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrganizerProfile;