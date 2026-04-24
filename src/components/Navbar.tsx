import { Search, User, LogOut, Menu, X, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../stores/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/events?search=${search.trim()}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleLocation = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && location.trim()) {
      navigate(`/events?location=${location.trim()}`);
      setLocation("");
      setMobileOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur border-b border-yellow-400/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
            </div>
            <span className="text-white font-bold hidden sm:block">EVORIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link to="/events" className="text-gray-300 hover:text-yellow-400 text-sm">Explore</Link>
            <Link to="/events" className="text-gray-300 hover:text-yellow-400 text-sm">Categories</Link>
          </div>

          {/* Desktop Search & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-slate-800/50 border border-yellow-400/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500 outline-none w-32 lg:w-40"
            />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleLocation}
              className="hidden lg:block bg-slate-800/50 border border-yellow-400/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500 outline-none w-32"
            />
            
            {user ? (
              <>
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-yellow-400" />
                  )}
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-yellow-400 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-yellow-400 text-sm">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded hover:bg-yellow-300">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden text-gray-300 hover:text-yellow-400">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-slate-900 border-t border-yellow-400/20 p-4 space-y-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-slate-800 border border-yellow-400/30 rounded px-3 py-2 text-white text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleLocation}
              className="w-full bg-slate-800 border border-yellow-400/30 rounded px-3 py-2 text-white text-sm outline-none"
            />
            <Link to="/events" className="block text-gray-300 hover:text-yellow-400 text-sm">Explore</Link>
            <Link to="/events" className="block text-gray-300 hover:text-yellow-400 text-sm">Categories</Link>
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-400 text-sm">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-yellow-400 text-sm">Login</Link>
                <Link to="/register" className="block px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded text-center">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;