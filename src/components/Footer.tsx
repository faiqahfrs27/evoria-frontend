import { Link } from "react-router";

function Footer() {
  return (
    <footer className="w-full bg-[#14141A]/70 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-[1152px]">
        <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.75)]">
                <div className="h-3 w-3 rounded-full bg-[#D4A94A]" />
              </div>
              <span
                className="text-sm font-semibold tracking-[0.16em] text-[#F9F3E8]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  letterSpacing: "0.15em",
                  color: "#F9F3E8",
                }}
              >
                EVORIA
              </span>
            </div>

            <p className="text-xs text-[#8A8A9A]">
              Discover extraordinary events
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#F9F3E8]">
              Explore
            </h4>

            <ul className="space-y-3 text-sm text-[#8A8A9A]">
              <li>
                <Link to="/events" className="transition hover:text-[#D4A94A]">
                  All Events
                </Link>
              </li>

              <li>
                <Link to="/events" className="transition hover:text-[#D4A94A]">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#F9F3E8]">
              Evoria Support
            </h4>

            <ul className="space-y-3 text-sm text-[#8A8A9A]">
              <li>
                <a
                  href="mailto:help@evoria.id"
                  className="transition hover:text-[#D4A94A]"
                >
                  E-mail: help@evoria.id
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-[#D4A94A]">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(212,169,74,0.14)] pt-8 text-center text-xs text-[#6F6F7D]">
          <p>&copy; 2026 Evoria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
