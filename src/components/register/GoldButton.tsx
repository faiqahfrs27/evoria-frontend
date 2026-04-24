interface GoldButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function GoldButton({
  children,
  type = "button",
  onClick,
  disabled,
  loading,
  variant = "primary",
  className,
}: GoldButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-lg py-3 px-6 text-sm font-medium transition-all duration-300 active:scale-[0.99]${className ? ` ${className}` : ""}`}
      style={{
        letterSpacing: "0.06em",
        fontFamily: "'DM Sans', sans-serif",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.55 : 1,
        ...(variant === "primary"
          ? {
              background:
                "linear-gradient(90deg, #B8862A, #D4A94A, #E8C97A)",
              color: "#0D0D0F",
              border: "none",
            }
          : {
              background: "transparent",
              border: "1px solid #26262E",
              color: "#F9F3E8",
            }),
      }}
    >
      {loading ? (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            style={{ animation: "spin 1s linear infinite", width: 15, height: 15 }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Memproses…
        </span>
      ) : (
        children
      )}
    </button>
  );
}