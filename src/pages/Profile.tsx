import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  ArrowLeft, Camera, Copy, Eye, EyeOff, Lock, Star,
  Tag, User, X, Check, Pencil, Receipt, Mail, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../stores/useAuth";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 4,
  border: "1px solid rgba(212,169,74,0.2)", background: "#1C1C22",
  color: "#F9F3E8", fontSize: 13, outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  fontSize: 10, color: "#8A8A9A", letterSpacing: "0.12em",
  textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 500,
};
const card: React.CSSProperties = {
  background: "#12121A", border: "1px solid rgba(212,169,74,0.1)", borderRadius: 8,
};
const goldBtn: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 4, border: "none",
  background: "linear-gradient(135deg, #D4A94A 0%, #C49A3A 100%)",
  color: "#0D0D0F", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  padding: "10px 20px", borderRadius: 4,
  border: "1px solid rgba(212,169,74,0.2)",
  background: "transparent", color: "#8A8A9A", fontSize: 11, cursor: "pointer",
};

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => axiosInstance.post("/auth/forgot-password", { email }),
    onSuccess: () => setSent(true),
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...card, padding: "32px 28px", maxWidth: 420, width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#5A5A6A", cursor: "pointer", display: "flex" }}>
          <X size={18} />
        </button>
        {!sent ? (
          <>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Mail size={20} color="#D4A94A" />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8", marginBottom: 8 }}>Forgot Password</p>
            <p style={{ fontSize: 13, color: "#8A8A9A", lineHeight: 1.6, marginBottom: 24 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && email && mutation.mutate()} placeholder="you@example.com" style={inp} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
              <button onClick={() => mutation.mutate()} disabled={!email.trim() || mutation.isPending} style={{ ...goldBtn, flex: 1, opacity: !email.trim() || mutation.isPending ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {mutation.isPending ? "Sending..." : <><span>Send Reset Link</span><ArrowRight size={13} /></>}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Mail size={24} color="#22C55E" />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8", marginBottom: 10 }}>Check your email</p>
            <p style={{ fontSize: 13, color: "#8A8A9A", lineHeight: 1.6, marginBottom: 8 }}>
              If <span style={{ color: "#F9F3E8" }}>{email}</span> is registered, we've sent a reset link.
            </p>
            <p style={{ fontSize: 12, color: "#5A5A6A", marginBottom: 24 }}>The link expires in 15 minutes.</p>
            <button onClick={onClose} style={{ ...goldBtn, padding: "10px 24px" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Update Profile Modal ─────────────────────────────────────────────────────
function UpdateProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const { user, login } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState(profile?.name ?? "");

  const mutation = useMutation({
    mutationFn: () => axiosInstance.patch("/profile", { name }),
    onSuccess: (res) => {
      toast.success("Profile updated");
      if (user) login({ ...user, name: res.data.data.name });
      qc.invalidateQueries({ queryKey: ["profile"] });
      onClose();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...card, padding: 28, maxWidth: 420, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#F9F3E8" }}>Edit Profile</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A9A", cursor: "pointer" }}><X size={17} /></button>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={lbl}>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inp} />
          </div>
          <div>
            <label style={lbl}>Email Address</label>
            <input value={profile?.email ?? ""} disabled style={{ ...inp, background: "#16161C", color: "#5A5A6A", cursor: "not-allowed" }} />
            <p style={{ fontSize: 10, color: "#5A5A6A", marginTop: 4 }}>Email cannot be changed</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending || name === profile?.name || !name.trim()} style={{ ...goldBtn, flex: 1, opacity: mutation.isPending || name === profile?.name ? 0.5 : 1 }}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Update Profile Pic Modal ─────────────────────────────────────────────────
function UpdatePicModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const { user, login } = useAuth();
  const qc = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("profilePic", file!);
      return axiosInstance.patch("/profile/picture", fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: (res) => {
      toast.success("Profile picture updated");
      if (user) login({ ...user, profilePic: res.data.data.profilePic });
      qc.invalidateQueries({ queryKey: ["profile"] });
      onClose();
    },
    onError: () => toast.error("Failed to upload"),
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...card, padding: 28, maxWidth: 380, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#F9F3E8" }}>Profile Picture</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A9A", cursor: "pointer" }}><X size={17} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,169,74,0.3)", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {preview ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : profile?.profilePic ? <img src={profile.profilePic} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <User size={36} color="#D4A94A" />}
          </div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.3)", color: "#D4A94A", fontSize: 11, cursor: "pointer" }}>
            <Camera size={13} /> Choose Photo
            <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          </label>
          {file && <p style={{ fontSize: 11, color: "#8A8A9A" }}>{file.name}</p>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
          <button onClick={() => mutation.mutate()} disabled={!file || mutation.isPending} style={{ ...goldBtn, flex: 1, opacity: !file || mutation.isPending ? 0.5 : 1 }}>
            {mutation.isPending ? "Uploading..." : "Save Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose, onForgotPassword }: { onClose: () => void; onForgotPassword: () => void }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const mutation = useMutation({
    mutationFn: () => axiosInstance.put("/profile/change-password", form),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      onClose();
    },
    onError: (e: AxiosError<{ message: string }>) =>
      toast.error(e.response?.data?.message || "Failed to change password"),
  });

  const fields = [
    { key: "currentPassword", label: "Current Password", showKey: "current" as const },
    { key: "newPassword", label: "New Password", showKey: "new" as const },
    { key: "confirmNewPassword", label: "Confirm New Password", showKey: "confirm" as const },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...card, padding: 28, maxWidth: 420, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#F9F3E8" }}>Change Password</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A9A", cursor: "pointer" }}><X size={17} /></button>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {fields.map((f) => (
            <div key={f.key}>
              <label style={lbl}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <input type={show[f.showKey] ? "text" : "password"} value={form[f.key as keyof typeof form]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder="••••••••" style={{ ...inp, paddingRight: 42 }} />
                <button type="button" onClick={() => setShow((s) => ({ ...s, [f.showKey]: !s[f.showKey] }))} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8A8A9A", cursor: "pointer", display: "flex" }}>
                  {show[f.showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending} style={{ ...goldBtn, flex: 1, opacity: mutation.isPending ? 0.5 : 1 }}>
              {mutation.isPending ? "Changing..." : "Change Password"}
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <button type="button" onClick={onForgotPassword} style={{ fontSize: 12, color: "#8A8A9A", background: "none", border: "none", cursor: "pointer" }}>
              Forgot password? <span style={{ color: "#D4A94A" }}>Reset here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Points Section ───────────────────────────────────────────────────────────
function PointsSection({ pointBalance }: { pointBalance: number }) {
  const { data: points = [] } = useQuery({
    queryKey: ["my-points"],
    queryFn: async () => (await axiosInstance.get("/profile/points")).data.data ?? [],
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return (
    <div style={{ ...card, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Star size={16} color="#D4A94A" />
        <p style={{ fontSize: 13, color: "#F9F3E8", fontWeight: 500 }}>Points</p>
      </div>
      <div style={{ background: "rgba(212,169,74,0.06)", border: "1px solid rgba(212,169,74,0.15)", borderRadius: 6, padding: "20px", textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontSize: 10, color: "#8A8A9A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Available Balance</p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "#D4A94A", lineHeight: 1 }}>{fmt(pointBalance)}</p>
        <p style={{ fontSize: 11, color: "#5A5A6A", marginTop: 6 }}>Redeemable on checkout</p>
      </div>
      {points.length === 0 ? (
        <p style={{ fontSize: 12, color: "#5A5A6A", textAlign: "center", padding: "8px 0" }}>No points yet. Refer friends to earn points!</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ ...lbl, marginBottom: 4 }}>History</p>
          {points.map((pt: any) => (
            <div key={pt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 4, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <p style={{ fontSize: 12, color: "#F9F3E8", marginBottom: 2 }}>{pt.source}</p>
                <p style={{ fontSize: 10, color: "#5A5A6A" }}>Expires {fmtDate(pt.expiresAt)}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#D4A94A" }}>+{fmt(pt.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vouchers Section ─────────────────────────────────────────────────────────
function VouchersSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: vouchers = [] } = useQuery({
    queryKey: ["my-vouchers"],
    queryFn: async () => (await axiosInstance.get("/profile/vouchers")).data.data ?? [],
    retry: false,
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Copied!");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div style={{ ...card, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Tag size={16} color="#D4A94A" />
        <p style={{ fontSize: 13, color: "#F9F3E8", fontWeight: 500 }}>My Coupons</p>
      </div>
      {vouchers.length === 0 ? (
        <p style={{ fontSize: 12, color: "#5A5A6A", textAlign: "center", padding: "8px 0" }}>No coupons. Register with a referral code to get one!</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {vouchers.map((v: any) => {
            const isExpired = new Date(v.expiresAt) < new Date();
            return (
              <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 6, border: `1px solid ${isExpired ? "rgba(239,68,68,0.18)" : "rgba(212,169,74,0.18)"}`, background: isExpired ? "rgba(239,68,68,0.03)" : "rgba(212,169,74,0.03)", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: isExpired ? "#6B7280" : "#D4A94A", letterSpacing: "0.06em", marginBottom: 2 }}>{v.code}</p>
                  <p style={{ fontSize: 11, color: "#8A8A9A" }}>{v.discountPercent ? `${v.discountPercent}% off` : fmt(v.discountAmount ?? 0)} · Expires {fmtDate(v.expiresAt)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 10, background: isExpired ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${isExpired ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, color: isExpired ? "#EF4444" : "#22C55E" }}>
                    {isExpired ? "Expired" : "Active"}
                  </span>
                  {!isExpired && (
                    <button onClick={() => handleCopy(v.id, v.code)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.25)", background: "transparent", color: "#D4A94A", fontSize: 11, cursor: "pointer" }}>
                      {copiedId === v.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPicModal, setShowPicModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const { data: profile, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await axiosInstance.get("/profile")).data.data,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handleCopyReferral = () => {
    if (!profile?.referralCode) return;
    navigator.clipboard.writeText(profile.referralCode);
    setCopiedReferral(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedReferral(false), 1500);
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#0D0D0F", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ position: "fixed", top: "20%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: "rgba(212,169,74,0.04)", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />
        <Navbar />
        <main style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "100px 24px 60px" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8A8A9A", textDecoration: "none", letterSpacing: "0.08em", marginBottom: 28 }}>
            <ArrowLeft size={13} /> Back to Home
          </Link>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#D4A94A", fontWeight: 500, marginBottom: 6 }}>My Account</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, color: "#F9F3E8", lineHeight: 1.2 }}>
              Profile <span style={{ color: "#D4A94A" }}>Settings</span>
            </h1>
          </div>

          {isPending ? (
            <div style={{ ...card, padding: "48px", textAlign: "center" }}>
              <p style={{ color: "#5A5A6A", fontSize: 13 }}>Loading...</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ ...card, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,169,74,0.25)", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {profile?.profilePic ? <img src={profile.profilePic} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={32} color="#D4A94A" />}
                    </div>
                    <button onClick={() => setShowPicModal(true)} style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#D4A94A", border: "2px solid #0D0D0F", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Camera size={12} color="#0D0D0F" />
                    </button>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 18, color: "#F9F3E8", fontWeight: 500, marginBottom: 3 }}>{profile?.name}</p>
                    <p style={{ fontSize: 12, color: "#8A8A9A", marginBottom: 10 }}>{profile?.email}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => setShowEditModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.25)", background: "transparent", color: "#D4A94A", fontSize: 11, cursor: "pointer" }}>
                        <Pencil size={12} /> Edit Profile
                      </button>
                      <button onClick={() => setShowPasswordModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#8A8A9A", fontSize: 11, cursor: "pointer" }}>
                        <Lock size={12} /> Change Password
                      </button>
                    </div>
                  </div>
                </div>

                {profile?.referralCode && (
                  <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(212,169,74,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <p style={{ ...lbl, marginBottom: 4 }}>Your Referral Code</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#D4A94A", letterSpacing: "0.1em" }}>{profile.referralCode}</p>
                      <p style={{ fontSize: 11, color: "#5A5A6A", marginTop: 2 }}>Friends who use this code earn you points</p>
                    </div>
                    <button onClick={handleCopyReferral} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 4, border: "1px solid rgba(212,169,74,0.25)", background: "transparent", color: "#D4A94A", fontSize: 11, cursor: "pointer" }}>
                      {copiedReferral ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Link to="/transactions" style={{ ...card, padding: "18px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Receipt size={16} color="#D4A94A" />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: "#F9F3E8", fontWeight: 500, marginBottom: 1 }}>My Orders</p>
                    <p style={{ fontSize: 10, color: "#5A5A6A" }}>Transaction history</p>
                  </div>
                </Link>
                <button onClick={() => setShowForgotModal(true)} style={{ ...card, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", width: "100%", textAlign: "left" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={16} color="#D4A94A" />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: "#F9F3E8", fontWeight: 500, marginBottom: 1 }}>Forgot Password</p>
                    <p style={{ fontSize: 10, color: "#5A5A6A" }}>Reset via email</p>
                  </div>
                </button>
              </div>

              <PointsSection pointBalance={profile?.pointBalance ?? 0} />
              <VouchersSection />
            </div>
          )}
        </main>
        <Footer />
      </div>

      {showEditModal && <UpdateProfileModal profile={profile} onClose={() => setShowEditModal(false)} />}
      {showPicModal && <UpdatePicModal profile={profile} onClose={() => setShowPicModal(false)} />}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onForgotPassword={() => { setShowPasswordModal(false); setShowForgotModal(true); }}
        />
      )}
      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </>
  );
}