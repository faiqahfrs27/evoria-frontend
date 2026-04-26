import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import {
  CheckCircle, XCircle, Eye, Camera, User, DollarSign,
  TrendingUp, Calendar, ReceiptText, Plus, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../stores/useAuth";
import { DashTable } from "./DashTable";
import { StatCard } from "./StatCard";
import { EventSelector } from "./EventSelector";
import {
  cardStyle, fmt, ghostBtn, goldBtn, inputStyle, labelStyle,
  statusColor, statusLabel, type Period, type Tab,
} from "../../components/utils/DashboardUtils";

// ─── Overview ─────────────────────────────────────────────────────────────────
export function OverviewTab({ stats, events, period, setPeriod, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }: {
  stats: any; events: any[]; period: Period; setPeriod: (p: Period) => void;
  selectedYear: string; setSelectedYear: (y: string) => void;
  selectedMonth: string; setSelectedMonth: (m: string) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {(["day", "month", "year"] as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 14px", borderRadius: 3, border: `1px solid ${period === p ? "#D4A94A" : "rgba(212,169,74,0.16)"}`, background: period === p ? "rgba(212,169,74,0.08)" : "transparent", color: period === p ? "#D4A94A" : "#8A8A9A", fontSize: 11, cursor: "pointer" }}>
            {p === "day" ? "Last 30 Days" : p === "month" ? "Monthly" : "Yearly"}
          </button>
        ))}
        {period !== "day" && (
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: "5px 10px", borderRadius: 3, border: "1px solid rgba(212,169,74,0.16)", background: "#1C1C22", color: "#F9F3E8", fontSize: 11 }}>
            {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {period === "month" && (
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ padding: "5px 10px", borderRadius: 3, border: "1px solid rgba(212,169,74,0.16)", background: "#1C1C22", color: "#F9F3E8", fontSize: 11 }}>
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>)}
          </select>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard label="Revenue" value={fmt(stats?.summary?.totalRevenue ?? 0)} icon={<DollarSign size={15} color="#D4A94A" />} />
        <StatCard label="Tickets Sold" value={stats?.summary?.totalTicketsSold ?? 0} icon={<TrendingUp size={15} color="#D4A94A" />} />
        <StatCard label="Transactions" value={stats?.summary?.totalTransactions ?? 0} icon={<ReceiptText size={15} color="#D4A94A" />} />
        <StatCard label="Events" value={events.length} icon={<Calendar size={15} color="#D4A94A" />} />
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {[
          { title: "Revenue", key: "revenue", type: "bar" },
          { title: "Tickets Sold", key: "tickets", type: "line" },
        ].map(({ title, key, type }) => (
          <div key={title} style={cardStyle}>
            <p style={{ fontSize: 9, color: "#8A8A9A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{title}</p>
            {stats?.chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                {type === "bar" ? (
                  <BarChart data={stats.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="label" tick={{ fill: "#5A5A6A", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#5A5A6A", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "#1C1C22", border: "1px solid rgba(212,169,74,0.2)", borderRadius: 4, fontSize: 11 }} labelStyle={{ color: "#D4A94A" }} formatter={(v) => [fmt(Number(v)), "Revenue"]} />
                    <Bar dataKey={key} fill="#D4A94A" radius={[2, 2, 0, 0]} opacity={0.85} />
                  </BarChart>
                ) : (
                  <LineChart data={stats.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="label" tick={{ fill: "#5A5A6A", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#5A5A6A", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1C1C22", border: "1px solid rgba(212,169,74,0.2)", borderRadius: 4, fontSize: 11 }} labelStyle={{ color: "#D4A94A" }} />
                    <Line type="monotone" dataKey={key} stroke="#D4A94A" strokeWidth={1.5} dot={{ fill: "#D4A94A", r: 2 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
export function EventsTab({ events, onGoTo, setSelectedEventId }: {
  events: any[]; onGoTo: (t: Tab) => void; setSelectedEventId: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => onGoTo("create-event")} style={{ ...ghostBtn, color: "#D4A94A", borderColor: "rgba(212,169,74,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={12} /> Create Event
        </button>
      </div>
      <DashTable
        headers={["Event", "Date", "Location", "Seats", "Price", "Actions"]}
        minWidth={700}
        rows={events.map((event) => [
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {event.imageUrl && <img src={event.imageUrl} alt="" style={{ width: 34, height: 34, borderRadius: 4, objectFit: "cover" }} />}
            <span style={{ color: "#F9F3E8" }}>{event.name}</span>
          </div>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>{new Date(event.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>{event.location}</span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>{event.availableSeats}/{event.totalSeats}</span>,
          <span style={{ color: "#D4A94A", fontSize: 11 }}>{event.isFree ? "Free" : fmt(event.price)}</span>,
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setSelectedEventId(event.id); onGoTo("transactions"); }} style={ghostBtn}>Orders</button>
            <button onClick={() => { setSelectedEventId(event.id); onGoTo("attendees"); }} style={ghostBtn}>Attendees</button>
          </div>,
        ])}
      />
    </div>
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export function TransactionsTab({ events, transactions, selectedEventId, setSelectedEventId }: {
  events: any[]; transactions: any[]; selectedEventId: string | null; setSelectedEventId: (id: string | null) => void;
}) {
  const qc = useQueryClient();
  const [proofModal, setProofModal] = useState<string | null>(null);

  const acceptMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/dashboard/transactions/${id}/accept`),
    onSuccess: () => { toast.success("Accepted"); qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] }); },
    onError: () => toast.error("Failed to accept"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/dashboard/transactions/${id}/reject`),
    onSuccess: () => { toast.success("Rejected"); qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] }); },
    onError: () => toast.error("Failed to reject"),
  });

  const rows = transactions.map((tx) => [
    <span style={{ color: "#F9F3E8" }}>{tx.ticketType?.name ?? "General"}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{tx.customer?.email}</span>,
    tx.paymentProof
      ? <button onClick={() => setProofModal(tx.paymentProof)} style={{ ...ghostBtn, color: "#D4A94A", borderColor: "rgba(212,169,74,0.3)", display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}><Eye size={11} /> View</button>
      : <span style={{ color: "#5A5A6A" }}>—</span>,
    <span style={{ color: "#F9F3E8", textAlign: "center" as const }}>{tx.quantity}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{fmt(tx.basePrice)}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{tx.voucher?.code ?? "—"}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{tx.pointUsed > 0 ? tx.pointUsed : "—"}</span>,
    <span style={{ color: "#D4A94A", fontSize: 11 }}>{fmt(tx.finalPrice)}</span>,
    <span style={{ padding: "3px 9px", borderRadius: 3, background: `${statusColor[tx.status] ?? "#6B7280"}18`, border: `1px solid ${statusColor[tx.status] ?? "#6B7280"}40`, color: statusColor[tx.status] ?? "#6B7280", fontSize: 10 }}>
      {statusLabel[tx.status] ?? tx.status}
    </span>,
    tx.status === "WAITING_FOR_ADMIN_CONFIRMATION" ? (
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => acceptMutation.mutate(tx.id)} style={{ padding: "4px 10px", borderRadius: 3, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)", color: "#22C55E", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <CheckCircle size={10} /> Accept
        </button>
        <button onClick={() => rejectMutation.mutate(tx.id)} style={{ padding: "4px 10px", borderRadius: 3, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#EF4444", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <XCircle size={10} /> Reject
        </button>
      </div>
    ) : <span />,
  ]);

  return (
    <div>
      <EventSelector events={events} value={selectedEventId} onChange={setSelectedEventId} />
      <DashTable
        headers={["Event", "Email", "Payment Method", "Qty", "Total Ticket Price", "Voucher Used", "Point Used", "Final Price", "Status", ""]}
        rows={rows}
        emptyMessage={!selectedEventId ? "Select an event to view orders." : "No results."}
        minWidth={900}
      />
      {proofModal && (
        <div onClick={() => setProofModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <img src={proofModal} alt="Payment proof" style={{ maxWidth: "88vw", maxHeight: "80vh", borderRadius: 6, border: "1px solid rgba(212,169,74,0.15)" }} />
            <button onClick={() => setProofModal(null)} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 6 }}><X size={11} /> Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Manual Payments ──────────────────────────────────────────────────────────
export function ManualPaymentsTab({ events, transactions, selectedEventId, setSelectedEventId }: {
  events: any[]; transactions: any[]; selectedEventId: string | null; setSelectedEventId: (id: string | null) => void;
}) {
  const qc = useQueryClient();
  const [proofModal, setProofModal] = useState<string | null>(null);

  const pendingTransactions = transactions.filter((tx) => tx.status === "WAITING_FOR_ADMIN_CONFIRMATION");

  const acceptMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/dashboard/transactions/${id}/accept`),
    onSuccess: () => { toast.success("Accepted"); qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] }); },
    onError: () => toast.error("Failed to accept"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.patch(`/dashboard/transactions/${id}/reject`),
    onSuccess: () => { toast.success("Rejected"); qc.invalidateQueries({ queryKey: ["dashboard", "transactions"] }); },
    onError: () => toast.error("Failed to reject"),
  });

  const rows = pendingTransactions.map((tx) => [
    <span style={{ color: "#F9F3E8" }}>{tx.customer?.name}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{tx.customer?.email}</span>,
    tx.paymentProof
      ? <button onClick={() => setProofModal(tx.paymentProof)} style={{ ...ghostBtn, color: "#D4A94A", borderColor: "rgba(212,169,74,0.3)", display: "flex", alignItems: "center", gap: 4, padding: "4px 10px" }}><Eye size={11} /> View Proof</button>
      : <span style={{ color: "#5A5A6A" }}>No proof yet</span>,
    <span style={{ color: "#F9F3E8", textAlign: "center" as const }}>{tx.quantity}</span>,
    <span style={{ color: "#8A8A9A", fontSize: 11 }}>{fmt(tx.basePrice)}</span>,
    <span style={{ color: "#D4A94A", fontSize: 11 }}>{fmt(tx.finalPrice)}</span>,
    <span style={{ color: "#5A5A6A", fontSize: 11 }}>{new Date(tx.createdAt).toLocaleDateString("id-ID")}</span>,
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={() => acceptMutation.mutate(tx.id)} style={{ padding: "4px 10px", borderRadius: 3, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)", color: "#22C55E", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
        <CheckCircle size={10} /> Accept
      </button>
      <button onClick={() => rejectMutation.mutate(tx.id)} style={{ padding: "4px 10px", borderRadius: 3, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "#EF4444", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
        <XCircle size={10} /> Reject
      </button>
    </div>,
  ]);

  return (
    <div>
      <EventSelector events={events} value={selectedEventId} onChange={setSelectedEventId} />
      <DashTable
        headers={["Customer", "Email", "Payment Proof", "Qty", "Base Price", "Final Price", "Date", "Actions"]}
        rows={rows}
        emptyMessage={!selectedEventId ? "Select an event to view pending payments." : "No pending payments."}
        minWidth={800}
      />
      {proofModal && (
        <div onClick={() => setProofModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <img src={proofModal} alt="Payment proof" style={{ maxWidth: "88vw", maxHeight: "80vh", borderRadius: 6, border: "1px solid rgba(212,169,74,0.15)" }} />
            <button onClick={() => setProofModal(null)} style={{ ...ghostBtn, display: "flex", alignItems: "center", gap: 6 }}><X size={11} /> Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Attendees ────────────────────────────────────────────────────────────────
export function AttendeesTab({ events, attendees, selectedEventId, setSelectedEventId }: {
  events: any[]; attendees: any[]; selectedEventId: string | null; setSelectedEventId: (id: string | null) => void;
}) {
  const totalQty = attendees.reduce((s, a) => s + a.quantity, 0);
  const totalRev = attendees.reduce((s, a) => s + a.finalPrice, 0);

  return (
    <div>
      <EventSelector events={events} value={selectedEventId} onChange={setSelectedEventId} />
      {selectedEventId && attendees.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <StatCard label="Total Attendees" value={totalQty} icon={<></>} />
          <StatCard label="Total Revenue" value={fmt(totalRev)} icon={<></>} />
        </div>
      )}
      <DashTable
        headers={["Name", "Email", "Ticket Type", "Qty", "Total Paid", "Date"]}
        rows={attendees.map((a) => [
          <span style={{ color: "#F9F3E8" }}>{a.customer?.name}</span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>{a.customer?.email}</span>,
          <span style={{ color: "#8A8A9A", fontSize: 11 }}>{a.ticketType?.name ?? "General"}</span>,
          <span style={{ color: "#F9F3E8", textAlign: "center" as const }}>{a.quantity}</span>,
          <span style={{ color: "#D4A94A", fontSize: 11 }}>{fmt(a.finalPrice)}</span>,
          <span style={{ color: "#5A5A6A", fontSize: 11 }}>{new Date(a.createdAt).toLocaleDateString("id-ID")}</span>,
        ])}
        emptyMessage={!selectedEventId ? "Select an event." : "No results."}
      />
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function ProfileTab() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name ?? "");

  const updateMutation = useMutation({
    mutationFn: () => axiosInstance.put("/dashboard/organizer/profile", { name }),
    onSuccess: (res) => { toast.success("Profile updated"); if (user) login({ ...user, name: res.data.data.name }); },
    onError: () => toast.error("Failed"),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("profilePic", file);
      return axiosInstance.patch("/dashboard/organizer/profile/picture", fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: (res) => { toast.success("Picture updated"); if (user) login({ ...user, profilePic: res.data.data.profilePic }); },
    onError: () => toast.error("Failed to upload"),
  });

  return (
    <div style={{ maxWidth: 460, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 14 }}>Profile Picture</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.22)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {user?.profilePic ? <img src={user.profilePic} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={20} color="#D4A94A" />}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.3)", color: "#D4A94A", fontSize: 11, cursor: "pointer" }}>
            <Camera size={12} /> Upload Photo
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f); }} />
          </label>
        </div>
      </div>
      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 14 }}>Edit Profile</p>
        <div style={{ display: "grid", gap: 12 }}>
          <div><label style={labelStyle}>Name</label><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Email</label><input value={user?.email ?? ""} disabled style={{ ...inputStyle, background: "#16161C", color: "#5A5A6A", border: "1px solid rgba(255,255,255,0.05)" }} /></div>
          <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} style={goldBtn}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password ──────────────────────────────────────────────────────────
export function ChangePasswordTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

  const mutation = useMutation({
    mutationFn: () => axiosInstance.put("/dashboard/organizer/profile/change-password", form),
    onSuccess: () => { toast.success("Password changed"); setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed"),
  });

  return (
    <div style={{ maxWidth: 460 }}>
      <div style={cardStyle}>
        <div style={{ display: "grid", gap: 12 }}>
          {[{ key: "currentPassword", label: "Current Password" }, { key: "newPassword", label: "New Password" }, { key: "confirmNewPassword", label: "Confirm New Password" }].map((f) => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input type="password" value={form[f.key as keyof typeof form]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
            </div>
          ))}
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending} style={goldBtn}>
            {mutation.isPending ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Event ─────────────────────────────────────────────────────────────
export function CreateEventTab() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", description: "", category: "MUSIC", location: "",
    startDate: "", endDate: "", isFree: "false", price: "", totalSeats: "", availableSeats: "",
  });
  const [ticketTypes, setTicketTypes] = useState([{ name: "Regular", price: "", quota: "" }]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const createEventMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("location", form.location);
      fd.append("startDate", new Date(form.startDate).toISOString());
      fd.append("endDate", new Date(form.endDate).toISOString());
      fd.append("isFree", form.isFree);
      fd.append("price", form.isFree === "true" ? "0" : form.price);
      fd.append("totalSeats", form.totalSeats);
      fd.append("availableSeats", form.availableSeats);
      fd.append("ticketTypes", JSON.stringify(ticketTypes.map((t) => ({ name: t.name, price: Number(t.price), quota: Number(t.quota) }))));
      if (thumbnail) fd.append("thumbnail", thumbnail);
      return axiosInstance.post("/events", fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => { toast.success("Event created successfully"); queryClient.invalidateQueries({ queryKey: ["dashboard", "events"] }); navigate("/dashboard/events"); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create event"),
  });

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "isFree" && value === "true") {
        next.price = "0";
        setTicketTypes([{ name: "General Admission", price: "0", quota: prev.totalSeats || "" }]);
      }
      if (key === "totalSeats") {
        next.availableSeats = value;
        if (prev.isFree === "true") setTicketTypes([{ name: "General Admission", price: "0", quota: value }]);
      }
      return next;
    });
  };

  const updateTicketType = (index: number, key: "name" | "price" | "quota", value: string) =>
    setTicketTypes((prev) => prev.map((t, i) => i === index ? { ...t, [key]: value } : t));

  const addTicketType = () => setTicketTypes((prev) => [...prev, { name: "", price: form.isFree === "true" ? "0" : "", quota: "" }]);
  const removeTicketType = (index: number) => setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  const totalTicketQuota = ticketTypes.reduce((sum, t) => sum + Number(t.quota || 0), 0);

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error("Event name is required");
    if (form.name.trim().length < 3) return toast.error("Event name must be at least 3 characters");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (!form.location.trim()) return toast.error("Location is required");
    if (!form.startDate) return toast.error("Start date is required");
    if (!form.endDate) return toast.error("End date is required");
    if (!form.totalSeats) return toast.error("Total seats is required");
    if (!form.availableSeats) return toast.error("Available seats is required");
    if (!thumbnail) return toast.error("Thumbnail is required");
    if (new Date(form.endDate) <= new Date(form.startDate)) return toast.error("End date must be after start date");
    if (form.isFree === "false" && !form.price) return toast.error("Price is required for paid event");
    if (Number(form.totalSeats) < 1) return toast.error("Total seats must be at least 1");
    if (Number(form.availableSeats) < 1) return toast.error("Available seats must be at least 1");
    if (Number(form.availableSeats) > Number(form.totalSeats)) return toast.error("Available seats cannot be bigger than total seats");
    if (ticketTypes.length < 1) return toast.error("At least one ticket type is required");
    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) return toast.error("Every ticket type must have a name");
      if (form.isFree === "false" && !ticket.price) return toast.error("Every paid ticket type must have a price");
      if (!ticket.quota) return toast.error("Every ticket type must have a quota");
      if (Number(ticket.quota) < 1) return toast.error("Ticket quota must be at least 1");
      if (form.isFree === "false" && Number(ticket.price) < 1) return toast.error("Paid ticket price must be at least 1");
    }
    if (totalTicketQuota !== Number(form.totalSeats)) return toast.error("Total ticket type quota must be equal to total seats");
    createEventMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 22 }}>
          <p style={{ color: "#F9F3E8", fontFamily: "'Cormorant Garamond', serif", fontSize: 26, marginBottom: 6 }}>Create New Event</p>
          <p style={{ color: "#6F6F7D", fontSize: 13 }}>Fill in the event information, ticket types, and thumbnail before publishing the event.</p>
        </div>
        <div style={{ display: "grid", gap: 18 }}>
          <div><label style={labelStyle}>Event Name</label><input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Example: Konser Musik Jakarta" style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Example: Konser spektakuler di Jakarta" rows={5} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /></div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div><label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} style={inputStyle}>
                <option value="MUSIC">Music</option><option value="SPORTS">Sports</option><option value="FOOD">Food</option>
                <option value="ART">Art</option><option value="EDUCATION">Education</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div><label style={labelStyle}>Location</label><input value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="Example: Jakarta" style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div><label style={labelStyle}>Start Date</label><input type="datetime-local" value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>End Date</label><input type="datetime-local" value={form.endDate} onChange={(e) => updateForm("endDate", e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div><label style={labelStyle}>Event Type</label>
              <select value={form.isFree} onChange={(e) => updateForm("isFree", e.target.value)} style={inputStyle}>
                <option value="false">Paid Event</option><option value="true">Free Event</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Base Price</label>
              <input type="number" min="0" value={form.price} onChange={(e) => updateForm("price", e.target.value)} disabled={form.isFree === "true"} placeholder="Example: 150000" style={{ ...inputStyle, opacity: form.isFree === "true" ? 0.55 : 1 }} />
              <p style={{ color: "#5A5A6A", fontSize: 11, marginTop: 6 }}>For paid events, this can follow the regular ticket price.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div><label style={labelStyle}>Total Seats</label><input type="number" min="1" value={form.totalSeats} onChange={(e) => updateForm("totalSeats", e.target.value)} placeholder="Example: 200" style={inputStyle} /></div>
            <div><label style={labelStyle}>Available Seats</label><input type="number" min="1" value={form.availableSeats} onChange={(e) => updateForm("availableSeats", e.target.value)} placeholder="Example: 200" style={inputStyle} /></div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "#F9F3E8", fontSize: 14, marginBottom: 4 }}>Ticket Types</p>
                <p style={{ color: "#6F6F7D", fontSize: 11 }}>Example: VIP, Regular, Early Bird. Total quota must equal total seats.</p>
              </div>
              <button type="button" onClick={addTicketType} style={{ ...ghostBtn, color: "#D4A94A", borderColor: "rgba(212,169,74,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={12} /> Add Ticket
              </button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {ticketTypes.map((ticket, index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1.4fr) minmax(120px, 1fr) minmax(120px, 1fr) auto", gap: 10, alignItems: "end" }}>
                  <div><label style={labelStyle}>Ticket Name</label><input value={ticket.name} onChange={(e) => updateTicketType(index, "name", e.target.value)} placeholder="Example: VIP" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Ticket Price</label><input type="number" min="0" value={ticket.price} onChange={(e) => updateTicketType(index, "price", e.target.value)} disabled={form.isFree === "true"} placeholder="Example: 300000" style={{ ...inputStyle, opacity: form.isFree === "true" ? 0.55 : 1 }} /></div>
                  <div><label style={labelStyle}>Quota</label><input type="number" min="1" value={ticket.quota} onChange={(e) => updateTicketType(index, "quota", e.target.value)} placeholder="Example: 50" style={inputStyle} /></div>
                  <button type="button" onClick={() => removeTicketType(index)} disabled={ticketTypes.length === 1} style={{ ...ghostBtn, height: 39, opacity: ticketTypes.length === 1 ? 0.45 : 1 }}><X size={12} /></button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.12)", background: "rgba(212,169,74,0.04)", color: totalTicketQuota === Number(form.totalSeats) ? "#D4A94A" : "#EF4444", fontSize: 11 }}>
              Ticket quota total: {totalTicketQuota || 0} / {form.totalSeats || 0}
            </div>
          </div>

          <div><label style={labelStyle}>Thumbnail</label><input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} style={inputStyle} /></div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => navigate("/dashboard/events")} style={{ ...ghostBtn, padding: "11px 18px" }}>Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={createEventMutation.isPending} style={{ ...goldBtn, width: "auto", padding: "11px 22px", opacity: createEventMutation.isPending ? 0.7 : 1 }}>
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create Voucher ───────────────────────────────────────────────────────────
export function CreateVoucherTab({ events }: { events: any[] }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({ eventId: "", code: "", discountAmount: "", startDate: "", endDate: "", quota: "" });

  const createVoucherMutation = useMutation({
    mutationFn: async () => axiosInstance.post(`/events/${form.eventId}/vouchers`, {
      code: form.code,
      discountAmount: form.discountAmount,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      quota: form.quota,
    }),
    onSuccess: () => { toast.success("Voucher created successfully"); queryClient.invalidateQueries({ queryKey: ["dashboard", "events"] }); navigate("/dashboard/vouchers"); },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create voucher"),
  });

  const updateForm = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const selectedEvent = events.find((event) => event.id === form.eventId);

  const handleSubmit = () => {
    if (!form.eventId) return toast.error("Please select an event");
    if (!form.code.trim()) return toast.error("Voucher code is required");
    if (form.code.trim().length < 3) return toast.error("Voucher code must be at least 3 characters");
    if (!form.discountAmount) return toast.error("Discount amount is required");
    if (Number(form.discountAmount) < 1) return toast.error("Discount amount must be at least 1");
    if (!form.startDate) return toast.error("Start date is required");
    if (!form.endDate) return toast.error("End date is required");
    if (new Date(form.endDate) <= new Date(form.startDate)) return toast.error("End date must be after start date");
    if (!form.quota) return toast.error("Quota is required");
    if (Number(form.quota) < 1) return toast.error("Quota must be at least 1");
    createVoucherMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 22 }}>
          <p style={{ color: "#F9F3E8", fontFamily: "'Cormorant Garamond', serif", fontSize: 26, marginBottom: 6 }}>Create New Voucher</p>
          <p style={{ color: "#6F6F7D", fontSize: 13 }}>Create a discount voucher for one of your events.</p>
        </div>
        {events.length === 0 ? (
          <div style={{ border: "1px solid rgba(212,169,74,0.12)", background: "rgba(212,169,74,0.04)", padding: 18, borderRadius: 4 }}>
            <p style={{ color: "#F9F3E8", fontSize: 13, marginBottom: 6 }}>You do not have any events yet.</p>
            <p style={{ color: "#6F6F7D", fontSize: 12, marginBottom: 14 }}>Create an event first before creating a voucher.</p>
            <button type="button" onClick={() => navigate("/dashboard/create-event")} style={{ ...goldBtn, width: "auto", padding: "10px 16px" }}>Create Event</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <label style={labelStyle}>Select Event</label>
              <select value={form.eventId} onChange={(e) => updateForm("eventId", e.target.value)} style={inputStyle}>
                <option value="">Choose event</option>
                {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
              </select>
              {selectedEvent && <p style={{ color: "#5A5A6A", fontSize: 11, marginTop: 6 }}>Selected event: {selectedEvent.name}</p>}
            </div>
            <div>
              <label style={labelStyle}>Voucher Code</label>
              <input value={form.code} onChange={(e) => updateForm("code", e.target.value.toUpperCase())} placeholder="Example: EVORIA50" style={inputStyle} />
              <p style={{ color: "#5A5A6A", fontSize: 11, marginTop: 6 }}>Minimum 3 characters. Example: MUSIC50, VIPDISC, EARLYBIRD.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <div>
                <label style={labelStyle}>Discount Amount</label>
                <input type="text" inputMode="numeric" value={form.discountAmount} onChange={(e) => updateForm("discountAmount", e.target.value.replace(/\D/g, ""))} placeholder="Example: 50000" style={inputStyle} />
                <p style={{ color: "#5A5A6A", fontSize: 11, marginTop: 6 }}>Fixed discount in IDR, not percentage.</p>
              </div>
              <div>
                <label style={labelStyle}>Quota</label>
                <input type="text" inputMode="numeric" value={form.quota} onChange={(e) => updateForm("quota", e.target.value.replace(/\D/g, ""))} placeholder="Example: 20" style={inputStyle} />
                <p style={{ color: "#5A5A6A", fontSize: 11, marginTop: 6 }}>How many times this voucher can be used.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <div><label style={labelStyle}>Start Date</label><input type="datetime-local" value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>End Date</label><input type="datetime-local" value={form.endDate} onChange={(e) => updateForm("endDate", e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ border: "1px solid rgba(212,169,74,0.12)", background: "rgba(212,169,74,0.04)", padding: "12px 14px", borderRadius: 4 }}>
              <p style={{ color: "#D4A94A", fontSize: 12, marginBottom: 4 }}>Preview</p>
              <p style={{ color: "#8A8A9A", fontSize: 12 }}>
                Voucher <span style={{ color: "#F9F3E8" }}>{form.code || "CODE"}</span> gives IDR <span style={{ color: "#F9F3E8" }}>{form.discountAmount || "0"}</span> discount for <span style={{ color: "#F9F3E8" }}>{selectedEvent?.name || "selected event"}</span>.
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={() => navigate("/dashboard/vouchers")} style={{ ...ghostBtn, padding: "11px 18px" }}>Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={createVoucherMutation.isPending} style={{ ...goldBtn, width: "auto", padding: "11px 22px", opacity: createVoucherMutation.isPending ? 0.7 : 1 }}>
                {createVoucherMutation.isPending ? "Creating..." : "Create Voucher"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vouchers ─────────────────────────────────────────────────────────────────
export function VouchersTab({ events }: { events: any[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedEventId && events.length > 0) setSelectedEventId(events[0].id);
  }, [events, selectedEventId]);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ["dashboard", "vouchers", selectedEventId],
    queryFn: async () => (await axiosInstance.get(`/events/${selectedEventId}/vouchers`)).data.data ?? [],
    enabled: !!selectedEventId,
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ minWidth: 260 }}>
          <label style={labelStyle}>Select Event</label>
          <select value={selectedEventId ?? ""} onChange={(e) => setSelectedEventId(e.target.value)} style={inputStyle}>
            <option value="">Choose event</option>
            {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => { window.location.href = "/dashboard/create-voucher"; }} style={{ ...ghostBtn, color: "#D4A94A", borderColor: "rgba(212,169,74,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={12} /> Create Voucher
        </button>
      </div>

      {!selectedEventId ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}><p style={{ color: "#5A5A6A", fontSize: 13 }}>Select an event to view vouchers.</p></div>
      ) : isLoading ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}><p style={{ color: "#5A5A6A", fontSize: 13 }}>Loading vouchers...</p></div>
      ) : (
        <>
          {selectedEvent && <p style={{ color: "#6F6F7D", fontSize: 12, marginBottom: 10 }}>Showing vouchers for <span style={{ color: "#F9F3E8" }}>{selectedEvent.name}</span></p>}
          <DashTable
            headers={["Code", "Discount", "Quota", "Start Date", "End Date", "Status"]}
            minWidth={760}
            emptyMessage="No vouchers found for this event."
            rows={vouchers.map((voucher: any) => [
              <span style={{ color: "#F9F3E8", fontWeight: 600 }}>{voucher.code}</span>,
              <span style={{ color: "#D4A94A", fontSize: 11 }}>{fmt(voucher.discountAmount ?? voucher.discount ?? voucher.discountValue ?? voucher.value ?? 0)}</span>,
              <span style={{ color: "#8A8A9A", fontSize: 11 }}>{voucher.quota ?? "—"}</span>,
              <span style={{ color: "#8A8A9A", fontSize: 11 }}>{voucher.startDate ? new Date(voucher.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>,
              <span style={{ color: "#8A8A9A", fontSize: 11 }}>{voucher.endDate ? new Date(voucher.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>,
              <span style={{ padding: "3px 9px", borderRadius: 3, background: new Date(voucher.endDate) >= new Date() ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: new Date(voucher.endDate) >= new Date() ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(239,68,68,0.25)", color: new Date(voucher.endDate) >= new Date() ? "#22C55E" : "#EF4444", fontSize: 10 }}>
                {new Date(voucher.endDate) >= new Date() ? "Active" : "Expired"}
              </span>,
            ])}
          />
        </>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
export const PlaceholderTab = ({ title }: { title: string }) => (
  <div style={{ ...cardStyle, textAlign: "center", padding: "64px" }}>
    <p style={{ color: "#5A5A6A", fontSize: 13 }}>{title} — coming soon.</p>
  </div>
);