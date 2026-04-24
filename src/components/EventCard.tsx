import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
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

const CATEGORY_COLORS: Record<string, string> = {
  MUSIC: "#7c3aed",
  SPORTS: "#16a34a",
  FOOD: "#ea580c",
  ART: "#db2777",
  EDUCATION: "#2563eb",
  OTHER: "#4b5563",
};

function EventCard({ event }: EventCardProps) {
  const categoryColor = CATEGORY_COLORS[event.category] || "#4b5563";

  return (
    <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          cursor: "pointer",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: "11rem", overflow: "hidden" }}>
          {event.imageUrl ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={event.imageUrl}
              alt={event.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: "2.5rem", color: "rgba(250,204,21,0.3)" }}>✦</span>
            </div>
          )}
          <span style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: `${categoryColor}cc`,
            color: "#ffffff",
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "0.25rem 0.625rem",
            borderRadius: "9999px",
            backdropFilter: "blur(4px)",
          }}>
            {event.category}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "1rem" }}>
          <h3 style={{
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "0.5rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {event.name}
          </h3>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            color: "#9ca3af",
            fontSize: "0.75rem",
            marginBottom: "1rem",
          }}>
            <MapPin size={11} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {event.location}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: event.isFree ? "#4ade80" : "#ffffff" }}>
              {event.isFree ? "FREE" : formatPrice(event.price)}
            </span>
            <motion.div
              whileHover={{ scale: 1.15, background: "#facc15" }}
              transition={{ duration: 0.2 }}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                borderRadius: "9999px",
                background: "rgba(250,204,21,0.08)",
                border: "1px solid rgba(250,204,21,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={12} color="#facc15" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default EventCard;