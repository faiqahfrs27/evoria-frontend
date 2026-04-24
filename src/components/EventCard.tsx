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
  const categoryColors: Record<string, string> = {
    MUSIC: "from-purple-600 to-yellow-500",
    SPORTS: "from-green-600 to-yellow-500",
    FOOD: "from-pink-600 to-yellow-500",
    ART: "from-teal-600 to-yellow-500",
    EDUCATION: "from-blue-600 to-yellow-500",
    OTHER: "from-gray-600 to-yellow-500",
  };

  const gradient = categoryColors[event.category] || categoryColors.OTHER;

  return (
    <Link to={`/event/${event.id}`}>
      <div className="bg-slate-800/50 border border-yellow-400/30 rounded-lg overflow-hidden hover:border-yellow-400/60 transition-all duration-300 h-full flex flex-col group">
        {/* Image */}
        <div className={`h-40 bg-gradient-to-br ${gradient} overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
            {event.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <MapPin size={12} />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-700/50 mt-auto">
            <span className={`font-bold text-sm ${event.isFree ? "text-green-400" : "text-yellow-400"}`}>
              {event.isFree ? "FREE" : formatPrice(event.price)}
            </span>
            <div className="w-7 h-7 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all">
              <ArrowRight size={14} className="text-yellow-400 group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;