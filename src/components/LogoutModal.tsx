interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#12121A", border: "1px solid rgba(212,169,74,0.15)", borderRadius: 8, padding: "32px", maxWidth: 360, width: "90%", textAlign: "center" }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8", marginBottom: 8 }}>
          Sign Out
        </p>
        <p style={{ fontSize: 12, color: "#8A8A9A", marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure you want to sign out of your account?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.2)", background: "transparent", color: "#8A8A9A", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: "10px", borderRadius: 4, border: "none", background: "linear-gradient(135deg, #D4A94A, #C49A3A)", color: "#0D0D0F", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}