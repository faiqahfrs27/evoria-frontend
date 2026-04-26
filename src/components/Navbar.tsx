import { Search, User, LogOut, Menu, X, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../stores/useAuth";
import { LogoutModal } from "./LogoutModal";

const categories = [
  { label: "Music", value: "MUSIC" },
  { label: "Sports", value: "SPORTS" },
  { label: "Food", value: "FOOD" },
  { label: "Art", value: "ART" },
  { label: "Education", value: "EDUCATION" },
  { label: "Other", value: "OTHER" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const goToSearchPage = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/events?search=${encodeURIComponent(trimmed)}&page=1`);
    } else if (locationRouter.pathname === "/events") {
      navigate("/events");
    }
  };

  const goToCategory = (category: string) => {
    navigate(`/events?category=${category}&page=1`);
    setCategoryOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => goToSearchPage(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchPage(search);
      setMobileOpen(false);
    }
  };

  const logo = (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.75)]">
        <div className="h-3 w-3 rounded-full bg-[#D4A94A] shadow-[0_0_22px_rgba(212,169,74,0.45)]" />
      </div>
      <span
        className="text-[13px] font-semibold tracking-[0.18em] text-[#F9F3E8] sm:text-sm"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          letterSpacing: "0.15em",
          color: "#F9F3E8",
        }}
      >
        EVORIA
      </span>
    </Link>
  );

  const userAvatar = (
    <Link to="/profile">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.45)] bg-[rgba(212,169,74,0.08)]">
        {user?.profilePic ? (
          <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <User size={15} className="text-[#D4A94A]" />
        )}
      </div>
    </Link>
  );

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[rgba(212,169,74,0.16)] bg-[#0D0D0F]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">

          {/* Main bar */}
          <div className="flex h-20 items-center justify-between gap-6">
            {logo}

            {/* Desktop nav links */}
            <div className="hidden items-center gap-10 lg:flex">
              <Link
                to="/events"
                className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]"
              >
                Explore
              </Link>

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]"
                >
                  Categories
                </button>

                {categoryOpen && (
                  <div className="absolute left-1/2 top-6 w-56 -translate-x-1/2 rounded-[1rem] border border-[rgba(212,169,74,0.18)] bg-[#111116]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <div className="mb-2 border-b border-[rgba(212,169,74,0.12)] px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A94A]">
                        Browse by
                      </p>
                      <p className="mt-1 text-xs text-[#8A8A9A]">Event category</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => { navigate("/events"); setCategoryOpen(false); }}
                      className="group flex w-full items-center justify-between rounded-[0.75rem] px-3 py-2.5 text-left text-sm text-[#F9F3E8] transition hover:bg-[rgba(212,169,74,0.1)]"
                    >
                      <span>All Categories</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4A94A]/60 opacity-0 transition group-hover:opacity-100" />
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => goToCategory(cat.value)}
                        className="group flex w-full items-center justify-between rounded-[0.75rem] px-3 py-2.5 text-left text-sm text-[#B9B1A5] transition hover:bg-[rgba(212,169,74,0.1)] hover:text-[#F9F3E8]"
                      >
                        <span>{cat.label}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4A94A]/60 opacity-0 transition group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop search & auth */}
            <div className="hidden items-center gap-3 sm:flex">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/65" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 w-40 rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A]/80 pl-9 pr-3 text-sm text-[#F9F3E8] outline-none transition placeholder:text-[#6F6F7D] focus:border-[#D4A94A]/70 lg:w-44"
                />
              </div>

              {/* Location */}
              <div className="relative hidden lg:block">
                <MapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/65" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 w-36 rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A]/80 pl-9 pr-3 text-sm text-[#F9F3E8] outline-none transition placeholder:text-[#6F6F7D] focus:border-[#D4A94A]/70"
                />
              </div>

              {/* Auth */}
              {user ? (
                <>
                  {userAvatar}
                  {user.role === "ORGANIZER" && (
                    <Link
                      to="/dashboard"
                      className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => setShowLogout(true)}
                    className="flex items-center gap-1.5 text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="evoria-gold-button rounded-sm px-5 py-2 text-xs font-bold tracking-[0.08em] transition hover:brightness-110"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-[#F9F3E8] sm:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="space-y-4 border-t border-[rgba(212,169,74,0.16)] bg-[#0D0D0F] py-5 sm:hidden">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/65" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A] py-3 pl-9 pr-3 text-sm text-[#F9F3E8] outline-none placeholder:text-[#6F6F7D]"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A94A]/65" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A] py-3 pl-9 pr-3 text-sm text-[#F9F3E8] outline-none placeholder:text-[#6F6F7D]"
                />
              </div>

              <Link
                to="/events"
                onClick={() => setMobileOpen(false)}
                className="block text-xs tracking-[0.08em] text-[#8A8A9A]"
              >
                Explore
              </Link>

              {/* Mobile categories */}
              <div className="rounded-[1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/60 p-3">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A94A]">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { navigate("/events"); setMobileOpen(false); }}
                    className="rounded-sm border border-[rgba(212,169,74,0.18)] px-3 py-2 text-left text-xs text-[#F9F3E8]"
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => goToCategory(cat.value)}
                      className="rounded-sm border border-[rgba(212,169,74,0.18)] px-3 py-2 text-left text-xs text-[#B9B1A5] transition hover:border-[#D4A94A]/50 hover:text-[#F9F3E8]"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile auth */}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block text-xs tracking-[0.08em] text-[#8A8A9A]"
                  >
                    Profile
                  </Link>
                  {user.role === "ORGANIZER" && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block text-xs tracking-[0.08em] text-[#D4A94A]"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setShowLogout(true); setMobileOpen(false); }}
                    className="flex items-center gap-1.5 text-xs tracking-[0.08em] text-[#8A8A9A]"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-xs tracking-[0.08em] text-[#8A8A9A]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="evoria-gold-button block rounded-sm px-5 py-2 text-center text-xs font-bold tracking-[0.08em]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => { logout(); setShowLogout(false); }}
      />
    </>
  );
}

export default Navbar;
