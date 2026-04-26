import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  User,
  DollarSign,
  TrendingUp,
  Calendar,
  ReceiptText,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../stores/useAuth";
import { DashTable } from "./DashTable";
import { StatCard } from "./StatCard";
import { EventSelector } from "./EventSelector";
import {
  cardStyle,
  fmt,
  ghostBtn,
  goldBtn,
  inputStyle,
  labelStyle,
  statusColor,
  statusLabel,
  type Period,
  type Tab,
} from "../../components/utils/DashboardUtils";

// ─── Overview ─────────────────────────────────────────────────────────────────
export function OverviewTab({
  stats,
  events,
  period,
  setPeriod,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: {
  stats: any;
  events: any[];
  period: Period;
  setPeriod: (p: Period) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
}) {
  return (
    <div>
      {/* Period filter */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {(["day", "month", "year"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "5px 14px",
              borderRadius: 3,
              border: `1px solid ${period === p ? "#D4A94A" : "rgba(212,169,74,0.16)"}`,
              background:
                period === p ? "rgba(212,169,74,0.08)" : "transparent",
              color: period === p ? "#D4A94A" : "#8A8A9A",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {p === "day"
              ? "Last 30 Days"
              : p === "month"
                ? "Monthly"
                : "Yearly"}
          </button>
        ))}
        {period !== "day" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: 3,
              border: "1px solid rgba(212,169,74,0.16)",
              background: "#1C1C22",
              color: "#F9F3E8",
              fontSize: 11,
            }}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
        {period === "month" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: 3,
              border: "1px solid rgba(212,169,74,0.16)",
              background: "#1C1C22",
              color: "#F9F3E8",
              fontSize: 11,
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Revenue"
          value={fmt(stats?.summary?.totalRevenue ?? 0)}
          icon={<DollarSign size={15} color="#D4A94A" />}
        />
        <StatCard
          label="Tickets Sold"
          value={stats?.summary?.totalTicketsSold ?? 0}
          icon={<TrendingUp size={15} color="#D4A94A" />}
        />
        <StatCard
          label="Transactions"
          value={stats?.summary?.totalTransactions ?? 0}
          icon={<ReceiptText size={15} color="#D4A94A" />}
        />
        <StatCard
          label="Events"
          value={events.length}
          icon={<Calendar size={15} color="#D4A94A" />}
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {[
          { title: "Revenue", key: "revenue", type: "bar" },
          { title: "Tickets Sold", key: "tickets", type: "line" },
        ].map(({ title, key, type }) => (
          <div key={title} style={cardStyle}>
            <p
              style={{
                fontSize: 9,
                color: "#8A8A9A",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {title}
            </p>
            {stats?.chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                {type === "bar" ? (
                  <BarChart data={stats.chart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#5A5A6A", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#5A5A6A", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1C1C22",
                        border: "1px solid rgba(212,169,74,0.2)",
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                      labelStyle={{ color: "#D4A94A" }}
                      formatter={(v) => [fmt(Number(v)), "Revenue"]} // ✅ inline, tidak dari array
                    />
                    <Bar
                      dataKey={key}
                      fill="#D4A94A"
                      radius={[2, 2, 0, 0]}
                      opacity={0.85}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={stats.chart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#5A5A6A", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#5A5A6A", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1C1C22",
                        border: "1px solid rgba(212,169,74,0.2)",
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                      labelStyle={{ color: "#D4A94A" }}
                      // ✅ tidak perlu formatter untuk line chart
                    />
                    <Line
                      type="monotone"
                      dataKey={key}
                      stroke="#D4A94A"
                      strokeWidth={1.5}
                      dot={{ fill: "#D4A94A", r: 2 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#5A5A6A", fontSize: 12 }}>No data</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────
export function EventsTab({
  events,
  onGoTo,
  setSelectedEventId,
}: {
  events: any[];
  onGoTo: (t: Tab) => void;
  setSelectedEventId: (id: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 14,
        }}
      >
        <button
          onClick={() => onGoTo("create-event")}
          style={{
            ...ghostBtn,
            color: "#D4A94A",
            borderColor: "rgba(212,169,74,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={12} /> Create Event
        </button>
      </div>
      <DashTable
        headers={["Event", "Date", "Location", "Seats", "Price", "Actions"]}
        minWidth={700}
        rows={events.map((event) => [
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt=""
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 4,
                  objectFit: "cover",
                }}
              />
            )}
            <span style={{ color: "#F9F3E8" }}>{event.name}</span>
          </div>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>
            {new Date(event.startDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>
            {event.location}
          </span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>
            {event.availableSeats}/{event.totalSeats}
          </span>,
          <span style={{ color: "#D4A94A", fontSize: 11 }}>
            {event.isFree ? "Free" : fmt(event.price)}
          </span>,
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => {
                setSelectedEventId(event.id);
                onGoTo("transactions");
              }}
              style={ghostBtn}
            >
              Orders
            </button>
            <button
              onClick={() => {
                setSelectedEventId(event.id);
                onGoTo("attendees");
              }}
              style={ghostBtn}
            >
              Attendees
            </button>
          </div>,
        ])}
      />
    </div>
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export function TransactionsTab({
  events,
  transactions,
  selectedEventId,
  setSelectedEventId,
}: {
  events: any[];
  transactions: any[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
}) {
  const qc = useQueryClient();
  const [proofModal, setProofModal] = useState<string | null>(null);

  const acceptMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/dashboard/transactions/${id}/accept`),
    onSuccess: () => {
      toast.success("Accepted");
      qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] });
    },
    onError: () => toast.error("Failed to accept"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/dashboard/transactions/${id}/reject`),
    onSuccess: () => {
      toast.success("Rejected");
      qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] });
    },
    onError: () => toast.error("Failed to reject"),
  });

  const rows = transactions.map((tx) => [
    <span style={{ color: "#F9F3E8" }}>
      {tx.ticketType?.name ?? "General"}
    </span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>
      {tx.customer?.email}
    </span>,
    tx.paymentProof ? (
      <button
        onClick={() => setProofModal(tx.paymentProof)}
        style={{
          ...ghostBtn,
          color: "#D4A94A",
          borderColor: "rgba(212,169,74,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
        }}
      >
        <Eye size={11} /> View
      </button>
    ) : (
      <span style={{ color: "#5A5A6A" }}>—</span>
    ),
    <span style={{ color: "#F9F3E8", textAlign: "center" as const }}>
      {tx.quantity}
    </span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{fmt(tx.basePrice)}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>
      {tx.voucher?.code ?? "—"}
    </span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>
      {tx.pointUsed > 0 ? tx.pointUsed : "—"}
    </span>,
    <span style={{ color: "#D4A94A", fontSize: 11 }}>
      {fmt(tx.finalPrice)}
    </span>,
    <span
      style={{
        padding: "3px 9px",
        borderRadius: 3,
        background: `${statusColor[tx.status] ?? "#6B7280"}18`,
        border: `1px solid ${statusColor[tx.status] ?? "#6B7280"}40`,
        color: statusColor[tx.status] ?? "#6B7280",
        fontSize: 10,
      }}
    >
      {statusLabel[tx.status] ?? tx.status}
    </span>,
    tx.status === "WAITING_FOR_ADMIN_CONFIRMATION" ? (
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => acceptMutation.mutate(tx.id)}
          style={{
            padding: "4px 10px",
            borderRadius: 3,
            border: "1px solid rgba(34,197,94,0.3)",
            background: "rgba(34,197,94,0.06)",
            color: "#22C55E",
            fontSize: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CheckCircle size={10} /> Accept
        </button>
        <button
          onClick={() => rejectMutation.mutate(tx.id)}
          style={{
            padding: "4px 10px",
            borderRadius: 3,
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)",
            color: "#EF4444",
            fontSize: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <XCircle size={10} /> Reject
        </button>
      </div>
    ) : (
      <span />
    ),
  ]);

  return (
    <div>
      <EventSelector
        events={events}
        value={selectedEventId}
        onChange={setSelectedEventId}
      />
      <DashTable
        headers={[
          "Event",
          "Email",
          "Payment Method",
          "Qty",
          "Total Ticket Price",
          "Voucher Used",
          "Point Used",
          "Final Price",
          "Status",
          "",
        ]}
        rows={rows}
        emptyMessage={
          !selectedEventId ? "Select an event to view orders." : "No results."
        }
        minWidth={900}
      />
      {proofModal && (
        <div
          onClick={() => setProofModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <img
              src={proofModal}
              alt="Payment proof"
              style={{
                maxWidth: "88vw",
                maxHeight: "80vh",
                borderRadius: 6,
                border: "1px solid rgba(212,169,74,0.15)",
              }}
            />
            <button
              onClick={() => setProofModal(null)}
              style={{
                ...ghostBtn,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <X size={11} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Attendees ────────────────────────────────────────────────────────────────
export function AttendeesTab({
  events,
  attendees,
  selectedEventId,
  setSelectedEventId,
}: {
  events: any[];
  attendees: any[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
}) {
  const totalQty = attendees.reduce((s, a) => s + a.quantity, 0);
  const totalRev = attendees.reduce((s, a) => s + a.finalPrice, 0);

  return (
    <div>
      <EventSelector
        events={events}
        value={selectedEventId}
        onChange={setSelectedEventId}
      />
      {selectedEventId && attendees.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <StatCard label="Total Attendees" value={totalQty} icon={<></>} />
          <StatCard label="Total Revenue" value={fmt(totalRev)} icon={<></>} />
        </div>
      )}
      <DashTable
        headers={["Name", "Email", "Ticket Type", "Qty", "Total Paid", "Date"]}
        rows={attendees.map((a) => [
          <span style={{ color: "#F9F3E8" }}>{a.customer?.name}</span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>
            {a.customer?.email}
          </span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>
            {a.ticketType?.name ?? "General"}
          </span>,
          <span style={{ color: "#F9F3E8", textAlign: "center" as const }}>
            {a.quantity}
          </span>,
          <span style={{ color: "#D4A94A", fontSize: 11 }}>
            {fmt(a.finalPrice)}
          </span>,
          <span style={{ color: "#5A5A6A", fontSize: 11 }}>
            {new Date(a.createdAt).toLocaleDateString("id-ID")}
          </span>,
        ])}
        emptyMessage={!selectedEventId ? "Select an event." : "No results."}
      />
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");

  const updateMutation = useMutation({
    mutationFn: () => axiosInstance.patch("/profile", { name }),
    onSuccess: () => toast.success("Profile updated"),
    onError: () => toast.error("Failed"),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("profilePic", file);
      return axiosInstance.patch("/profile/picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => toast.success("Picture updated"),
    onError: () => toast.error("Failed to upload"),
  });

  return (
    <div style={{ maxWidth: 460, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 14 }}>Profile Picture</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(212,169,74,0.08)",
              border: "1px solid rgba(212,169,74,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={20} color="#D4A94A" />
            )}
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 4,
              border: "1px solid rgba(212,169,74,0.3)",
              color: "#D4A94A",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            <Camera size={12} /> Upload Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadMutation.mutate(f);
              }}
            />
          </label>
        </div>
      </div>
      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 14 }}>Edit Profile</p>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              value={user?.email ?? ""}
              disabled
              style={{
                ...inputStyle,
                background: "#16161C",
                color: "#5A5A6A",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            />
          </div>
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            style={goldBtn}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password ──────────────────────────────────────────────────────────
export function ChangePasswordTab() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const mutation = useMutation({
    mutationFn: () => axiosInstance.put("/profile/change-password", form),
    onSuccess: () => {
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  return (
    <div style={{ maxWidth: 460 }}>
      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Change Password</p>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { key: "currentPassword", label: "Current Password" },
            { key: "newPassword", label: "New Password" },
            { key: "confirmNewPassword", label: "Confirm New Password" },
          ].map((f) => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type="password"
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            style={goldBtn}
          >
            {mutation.isPending ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export const PlaceholderTab = ({ title }: { title: string }) => (
  <div style={{ ...cardStyle, textAlign: "center", padding: "64px" }}>
    <p style={{ color: "#5A5A6A", fontSize: 13 }}>{title} — coming soon.</p>
  </div>
);
