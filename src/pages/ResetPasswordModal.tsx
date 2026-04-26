import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 4,
  border: "1px solid rgba(212,169,74,0.2)", background: "#1C1C22",
  color: "#F9F3E8", fontSize: 13, outline: "none", boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
  fontSize: 10, color: "#8A8A9A", letterSpacing: "0.12em",
  textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: 500,
};

export default function ResetPasswordModal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmNewPassword: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () => axiosInstance.put(`/auth/reset-password/${token}`, form),
    onSuccess: () => setSuccess(true),
    onError: (e: any) => toast.error(e.response?.data?.message || "Invalid or expired token"),
  });

  const handleSubmit = () => {
    if (!form.newPassword) return toast.error("Password is required");
    if (form.newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (form.newPassword !== form.confirmNewPassword) return toast.error("Passwords don't match");
    mutation.mutate();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0F", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      {/* Glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "rgba(212,169,74,0.04)", filter: "blur(100px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(212,169,74,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#D4A94A" }} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: "0.18em", color: "#F9F3E8" }}>EVORIA</span>
        </div>

        <div style={{ background: "#12121A", border: "1px solid rgba(212,169,74,0.12)", borderRadius: 10, padding: "32px 28px" }}>
          {!success ? (
            <>
              {/* Icon */}
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Lock size={20} color="#D4A94A" />
              </div>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#F9F3E8", marginBottom: 6 }}>Reset Password</p>
              <p style={{ fontSize: 13, color: "#8A8A9A", lineHeight: 1.6, marginBottom: 28 }}>
                Create a new password for your account.
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                {/* New Password */}
                <div>
                  <label style={lbl}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={show.new ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="Min. 8 characters"
                      style={{ ...inp, paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8A8A9A", cursor: "pointer", display: "flex" }}
                    >
                      {show.new ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={lbl}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={show.confirm ? "text" : "password"}
                      value={form.confirmNewPassword}
                      onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
                      placeholder="Repeat password"
                      style={{ ...inp, paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8A8A9A", cursor: "pointer", display: "flex" }}
                    >
                      {show.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {form.confirmNewPassword && (
                    <p style={{ fontSize: 11, marginTop: 4, color: form.newPassword === form.confirmNewPassword ? "#22C55E" : "#EF4444" }}>
                      {form.newPassword === form.confirmNewPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                  style={{ width: "100%", padding: "11px", borderRadius: 4, border: "none", background: "linear-gradient(135deg, #D4A94A, #C49A3A)", color: "#0D0D0F", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: mutation.isPending ? 0.6 : 1, marginTop: 4 }}
                >
                  {mutation.isPending ? "Saving..." : "Reset Password"}
                </button>
              </div>
            </>
          ) : (
            // Success state
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={26} color="#22C55E" />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#F9F3E8", marginBottom: 10 }}>Password Updated!</p>
              <p style={{ fontSize: 13, color: "#8A8A9A", lineHeight: 1.6, marginBottom: 28 }}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{ padding: "10px 28px", borderRadius: 4, border: "none", background: "linear-gradient(135deg, #D4A94A, #C49A3A)", color: "#0D0D0F", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em" }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A5A6A", textDecoration: "none" }}>
            <ArrowLeft size={12} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}