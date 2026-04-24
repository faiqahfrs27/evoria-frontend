import { Search, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../stores/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/events?search=${search.trim()}`);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "82px",
        padding: "0 2rem",
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          marginTop: "20px",
          marginLeft: "80px",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            height: "100%",
          }}
        >
          <div
            style={{
              height: "120px",
              width: "220px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/Evoria Logo.png"
              alt="Evoria"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </Link>
      </motion.div>

      {/* Nav Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginLeft: "2rem",
          marginRight: "2rem",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {["Explore", "Categories"].map((item) => (
          <motion.div
            key={item}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              to="/events"
              style={{
                color: "#d1d5db",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              {item}
            </Link>
          </motion.div>
        ))}

        {user?.role === "ORGANIZER" && (
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link
              to="/dashboard"
              style={{
                color: "#d1d5db",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>
          </motion.div>
        )}

        {user && (
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
            <Link
              to="/profile"
              style={{
                color: "#d1d5db",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Profile
            </Link>
          </motion.div>
        )}
      </div>

      {/* Search + Auth */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9999px",
            padding: "0.55rem 1rem",
            width: "14rem",
            boxSizing: "border-box",
          }}
        >
          <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search mystical events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.8rem",
              width: "100%",
            }}
          />
        </div>

        {user ? (
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "9999px",
                background: "rgba(250,204,21,0.15)",
                border: "1px solid rgba(250,204,21,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User size={16} color="#facc15" />
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, color: "#ffffff" }}
              onClick={logout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        ) : (
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Link
              to="/login"
              style={{
                color: "#d1d5db",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                style={{
                  background: "#facc15",
                  color: "#000000",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Register
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;