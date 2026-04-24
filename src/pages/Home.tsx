import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Music2,
  Palette,
  Sparkles,
  Trophy,
  UtensilsCrossed
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80",
  ];

  const categories = [
    { label: "Music", value: "MUSIC", icon: Music2 },
    { label: "Sports", value: "SPORTS", icon: Trophy },
    { label: "Food", value: "FOOD", icon: UtensilsCrossed },
    { label: "Art", value: "ART", icon: Palette },
    { label: "Education", value: "EDUCATION", icon: GraduationCap },
    { label: "Other", value: "OTHER", icon: Sparkles },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const {
    data: events,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/events", {
        params: { take: 6, sortBy: "startDate", sortOrder: "asc" },
      });
      return data;
    },
  });

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/events?search=${search.trim()}`);
    } else {
      navigate("/events");
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/events?category=${category}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Carousel */}
        {backgrounds.map((bg, index) => (
          <motion.div
            key={bg}
            animate={{ opacity: index === currentBg ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${bg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.55))",
          }}
        />

        {/* Dot Indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
            zIndex: 10,
          }}
        >
          {backgrounds.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentBg(index)}
              animate={{
                width: index === currentBg ? "1.5rem" : "0.5rem",
                background:
                  index === currentBg ? "#facc15" : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                height: "0.5rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "0 1rem",
            maxWidth: "48rem",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "1.25rem",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            }}
          >
            <span style={{ color: "#ffffff", display: "block" }}>
              Discover the
            </span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ color: "#facc15", display: "block" }}
            >
              Extraordinary
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{
              color: "#d1d5db",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              marginBottom: "2.5rem",
              lineHeight: 1.7,
            }}
          >
            Embark on a journey through celestial workshops, cosmic music, and
            mystical art galleries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: "36rem",
              margin: "0 auto",
              borderRadius: "9999px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flex: 1,
                padding: "1rem 1.25rem",
              }}
            >
              <Compass size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Where will your journey take you?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  width: "100%",
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                background: "#facc15",
                color: "#000000",
                fontWeight: 600,
                padding: "1rem 1.75rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Explore Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ── */}
      <section
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 1rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "1.75rem",
          }}
        >
          <h2
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Explore by Categories
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.875rem",
            }}
          >
            Choose your path and discover events by category
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1rem",
          }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: "0 0 24px rgba(250,204,21,0.08)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.value)}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "1rem",
                  padding: "1.25rem 0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  backdropFilter: "blur(10px)",
                  minHeight: "130px",
                }}
              >
                <div
                  style={{
                    width: "3.75rem",
                    height: "3.75rem",
                    borderRadius: "9999px",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(250,204,21,0.22), rgba(250,204,21,0.08))",
                    border: "1px solid rgba(250,204,21,0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(250,204,21,0.08)",
                  }}
                >
                  <Icon size={24} color="#facc15" />
                </div>

                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {category.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── EVENTS SECTION ── */}
      <section
        style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              Upcoming Events
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Discover extraordinary experiences near you
            </p>
          </div>
          <Link
            to="/events"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "#facc15",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: "#f87171", fontSize: "0.875rem" }}>
              {error.message}
            </p>
            <button
              onClick={() => refetch()}
              style={{
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
                padding: "0.4rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {isPending && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isPending && events?.data?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "4rem 0" }}
          >
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</p>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              No events yet
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              The cosmos is quiet for now. Check back soon!
            </p>
          </motion.div>
        )}

        {/* Event Cards */}
        {!isPending && events?.data?.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {events.data.map((event: any, index: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA SECTION ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <div
          style={{
            borderRadius: "1rem",
            padding: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            background: "linear-gradient(135deg, #2a2a1a 0%, #1a1a0a 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                lineHeight: 1.3,
              }}
            >
              Ready to host your own cosmic event?
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.875rem",
                lineHeight: 1.7,
              }}
            >
              Join our community of mystical organizers and share your magic
              with the world. We provide all the tools you need to launch
              successfully.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              style={{
                background: "#ffffff",
                color: "#000000",
                fontWeight: 600,
                padding: "0.875rem 1.75rem",
                borderRadius: "9999px",
                textDecoration: "none",
                flexShrink: 0,
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              Become an Organizer
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10,10,15,0.98)",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2.5rem",
            }}
          >
            {/* Brand */}
            <div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.1rem",
                    marginBottom: "0rem",
                  }}
                >
                  <img
                    src="/Evoria Logo.png"
                    alt="Evoria Logo"
                    style={{
                      height: "5.5rem",
                      width: "0 rem",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              >
                The premier destination for discovering celestial workshops,
                cosmic music, and mystical art experiences.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Explore
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  "All Events",
                  "Featured Venues",
                  "Trending Categories",
                  "Mystical Guides",
                ].map((item) => (
                  <Link
                    key={item}
                    to="/events"
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h4
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Support
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  "Help Center",
                  "Safety Guide",
                  "Terms of Service",
                  "Privacy Policy",
                ].map((item) => (
                  <Link
                    key={item}
                    to="/"
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Subscribe */}
            <div>
              <h4
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Subscribe
              </h4>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                Get notified about upcoming astronomical phenomena and events.
              </p>
              <div
                style={{
                  display: "flex",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    padding: "0.625rem 0.75rem",
                  }}
                />
                <button
                  style={{
                    background: "#facc15",
                    color: "#000",
                    border: "none",
                    padding: "0.625rem 0.75rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: "3rem",
              paddingTop: "1.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#4b5563", fontSize: "0.75rem" }}>
              © 2024 Evoria Celestial Platform. All celestial bodies reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;