import { Search, User, Menu, X, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../stores/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    if (params.toString()) {
      navigate(`/events?${params.toString()}`);
      setSearch("");
      setLocation("");
      setMobileOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitFilters();
  };

  const logo = (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.75)]">
        <div className="h-3 w-3 rounded-full bg-[#D4A94A] shadow-[0_0_22px_rgba(212,169,74,0.45)]" />
      </div>
      <span className="text-[13px] font-semibold tracking-[0.18em] text-[#F9F3E8] sm:text-sm">
        EVORIA
      </span>
    </Link>
  );

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[rgba(212,169,74,0.16)] bg-[#0D0D0F]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {logo}

          <div className="hidden items-center gap-10 lg:flex">
            <Link to="/events" className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]">
              Explore
            </Link>
            <Link to="/events" className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]">
              Categories
            </Link>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
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

            {user ? (
              <>
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.45)] bg-[rgba(212,169,74,0.08)]">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={15} className="text-[#D4A94A]" />
                  )}
                </div>
                <button onClick={logout} className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs tracking-[0.08em] text-[#8A8A9A] transition hover:text-[#D4A94A]">
                  Login
                </Link>
                <Link to="/register" className="evoria-gold-button rounded-sm px-5 py-2 text-xs font-bold tracking-[0.08em] transition hover:brightness-110">
                  Register
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen((v) => !v)} className="text-[#F9F3E8] sm:hidden">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="space-y-4 border-t border-[rgba(212,169,74,0.16)] bg-[#0D0D0F] py-5 sm:hidden">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A] px-3 py-3 text-sm text-[#F9F3E8] outline-none"
            />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-sm border border-[rgba(212,169,74,0.32)] bg-[#14141A] px-3 py-3 text-sm text-[#F9F3E8] outline-none"
            />
            <Link to="/events" className="block text-sm text-[#8A8A9A] hover:text-[#D4A94A]">Explore</Link>
            <Link to="/events" className="block text-sm text-[#8A8A9A] hover:text-[#D4A94A]">Categories</Link>
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-[#D4A94A]">Logout</button>
            ) : (
              <Link to="/register" className="evoria-gold-button block rounded-sm px-4 py-3 text-center text-sm font-bold">Register</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
