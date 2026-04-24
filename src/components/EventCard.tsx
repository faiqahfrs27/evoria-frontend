import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/event/${event.id}`} className="group block h-full">
      <article className="evoria-card flex h-full flex-col overflow-hidden rounded-[1.1rem] transition duration-300 hover:-translate-y-1 hover:border-[rgba(212,169,74,0.42)]">
        <div className="relative h-44 overflow-hidden bg-[#1C1C22]">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(212,169,74,0.22),transparent_32%),linear-gradient(135deg,#1C1C22,#0D0D0F)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F]/90 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]/60 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#D4A94A] backdrop-blur">
            {event.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-6 text-[#F9F3E8] transition group-hover:text-[#E8C97A]">
            {event.name}
          </h3>

          <div className="mb-5 flex items-center gap-2 text-xs text-[#8A8A9A]">
            <MapPin size={13} className="text-[#D4A94A]/70" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[rgba(212,169,74,0.12)] pt-4">
            <span className="text-sm font-semibold text-[#D4A94A]">
              {event.isFree ? "FREE" : formatPrice(event.price)}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.32)] bg-[rgba(212,169,74,0.06)] transition group-hover:bg-[#D4A94A]">
              <ArrowRight size={15} className="text-[#D4A94A] transition group-hover:text-[#0D0D0F]" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default EventCard;
