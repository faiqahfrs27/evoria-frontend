import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { Event } from "../types/event";

type EventCardProps = {
  event: Event;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price || 0);
};

function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const handleGoToEventDetail = () => {
    navigate(`/events/${event.slug}`);
  };

  const handleGoToOrganizerProfile = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!event.organizer?.id) return;

    navigate(`/organizers/${event.organizer.id}`);
  };

  return (
    <article
      onClick={handleGoToEventDetail}
      className="group cursor-pointer overflow-hidden rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(212,169,74,0.36)] hover:shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
    >
      <div className="relative overflow-hidden rounded-[0.9rem] bg-[#14141A]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-[175px] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-[175px] w-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,169,74,0.22),transparent_28%),linear-gradient(135deg,#14141A,#0D0D0F)]" />
        )}

        <div className="absolute left-4 top-4 rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#D4A94A] backdrop-blur">
          {event.category}
        </div>
      </div>

      <div className="pt-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-6 text-[#F9F3E8]">
          {event.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#B9B1A5]">
          <MapPin size={15} className="text-[#D4A94A]" />
          <span>{event.location}</span>
        </div>

        {event.organizer?.name && (
          <button
            type="button"
            onClick={handleGoToOrganizerProfile}
            disabled={!event.organizer?.id}
            className="mt-3 flex w-fit items-center gap-2 rounded-full border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 px-2.5 py-1.5 transition hover:border-[rgba(212,169,74,0.4)] hover:bg-[rgba(212,169,74,0.08)] disabled:cursor-default"
          >
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]">
              {event.organizer.profilePic ? (
                <img
                  src={event.organizer.profilePic}
                  alt={event.organizer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-[#D4A94A]">
                  {(event.organizer.name || "O").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-[#B9B1A5]">
              {event.organizer.name}
            </span>
          </button>
        )}

        <div className="mt-6 border-t border-[rgba(212,169,74,0.14)] pt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-bold text-[#D4A94A]">
              {event.isFree || event.price === 0
                ? "Free"
                : formatPrice(event.price)}
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(212,169,74,0.28)] text-[#D4A94A] transition group-hover:bg-[#D4A94A] group-hover:text-[#0D0D0F]">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;