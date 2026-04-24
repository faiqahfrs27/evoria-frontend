interface AuthPanelProps {
  quote?: string;
  attribution?: string;
}

export default function AuthPanel({
  quote = "Where every moment becomes a memory worth keeping.",
  attribution = "Evoria",
}: AuthPanelProps) {
  return (
    <div
      className="relative hidden lg:flex flex-col w-[45%] overflow-hidden"
      style={{ background: "#141418", minHeight: "100vh" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(212,169,74,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(212,169,74,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(212,169,74,0.8) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "rgba(212,169,74,0.04)",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col h-full"
        style={{ padding: "48px 48px 48px 48px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: "1px solid rgba(212,169,74,0.6)" }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#D4A94A" }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              letterSpacing: "0.15em",
              color: "#F9F3E8",
            }}
          >
            EVORIA
          </span>
        </div>

        {/* Geometric rings — centered */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="relative w-44 h-44 xl:w-52 xl:h-52">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(212,169,74,0.18)",
                animation: "spin 20s linear infinite",
              }}
            />
            <div
              className="absolute inset-4 rounded-full"
              style={{
                border: "1px solid rgba(212,169,74,0.12)",
                animation: "spin 15s linear infinite reverse",
              }}
            />
            <div
              className="absolute inset-8 rounded-full"
              style={{ border: "1px solid rgba(212,169,74,0.08)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(212,169,74,0.08)",
                  border: "1px solid rgba(212,169,74,0.3)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 2L16.5 9.5H24.5L18.5 14.5L20.5 22L14 17.5L7.5 22L9.5 14.5L3.5 9.5H11.5L14 2Z"
                    stroke="#D4A94A"
                    strokeWidth="1"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,169,74,0.3))",
              }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(212,169,74,0.5)" }}
            />
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(212,169,74,0.3))",
              }}
            />
          </div>
        </div>

        {/* Quote */}
        <div style={{ paddingBottom: 8 }}>
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F0E6CC",
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8A8A9A",
            }}
          >
            — {attribution}
          </p>
        </div>
      </div>
    </div>
  );
}