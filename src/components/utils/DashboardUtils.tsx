// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Status Maps ──────────────────────────────────────────────────────────────
export const statusColor: Record<string, string> = {
  WAITING_FOR_PAYMENT: "#F59E0B",
  WAITING_FOR_ADMIN_CONFIRMATION: "#3B82F6",
  DONE: "#22C55E",
  REJECTED: "#EF4444",
  EXPIRED: "#6B7280",
  CANCELED: "#9CA3AF",
};

export const statusLabel: Record<string, string> = {
  WAITING_FOR_PAYMENT: "Waiting Payment",
  WAITING_FOR_ADMIN_CONFIRMATION: "Awaiting Confirmation",
  DONE: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CANCELED: "Canceled",
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 4,
  border: "1px solid rgba(212,169,74,0.2)",
  background: "#1C1C22",
  color: "#F9F3E8",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#8A8A9A",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
  fontWeight: 500,
};

export const cardStyle: React.CSSProperties = {
  background: "#12121A",
  border: "1px solid rgba(212,169,74,0.12)",
  borderRadius: 8,
  padding: "24px"
};

export const goldBtn: React.CSSProperties = {
  width: "100%",
  padding: "11px",
  borderRadius: 4,
  border: "none",
  background: "linear-gradient(135deg, #D4A94A 0%, #C49A3A 100%)",
  color: "#0D0D0F",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export const ghostBtn: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: 3,
  border: "1px solid rgba(212,169,74,0.25)",
  background: "transparent",
  color: "#8A8A9A",
  fontSize: 11,
  cursor: "pointer",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type Period = "day" | "month" | "year";
export type Tab =
  | "overview" | "events" | "create-event"
  | "transactions" | "manual-payments"
  | "tickets" | "create-ticket"
  | "vouchers" | "create-voucher"
  | "attendees" | "profile" | "change-password";

export const tabTitle: Record<Tab, string> = {
  overview: "Dashboard",
  events: "All Events",
  "create-event": "Create Event",
  transactions: "Order History",
  "manual-payments": "Manual Payments",
  tickets: "Tickets",
  "create-ticket": "Create Ticket",
  vouchers: "All Vouchers",
  "create-voucher": "Create Voucher",
  attendees: "Attendees",
  profile: "Profile",
  "change-password": "Change Password",
};