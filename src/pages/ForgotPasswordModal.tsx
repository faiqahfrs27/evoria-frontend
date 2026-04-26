import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Mail, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => axiosInstance.post("/auth/forgot-password", { email }),
    onSuccess: () => {
      setSent(true);
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#12121A",
          border: "1px solid rgba(212,169,74,0.15)",
          borderRadius: 10,
          padding: "32px 28px",
          maxWidth: 420,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#5A5A6A",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <X size={18} />
        </button>

        {!sent ? (
          <>
            {/* Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(212,169,74,0.08)",
                border: "1px solid rgba(212,169,74,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Mail size={20} color="#D4A94A" />
            </div>

            {/* Title */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                color: "#F9F3E8",
                marginBottom: 8,
              }}
            >
              Forgot Password
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#8A8A9A",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {/* Input */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 10,
                  color: "#8A8A9A",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && email && mutation.mutate()
                }
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 4,
                  border: "1px solid rgba(212,169,74,0.2)",
                  background: "#1C1C22",
                  color: "#F9F3E8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 4,
                  border: "1px solid rgba(212,169,74,0.2)",
                  background: "transparent",
                  color: "#8A8A9A",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => mutation.mutate()}
                disabled={!email.trim() || mutation.isPending}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 4,
                  border: "none",
                  background: "linear-gradient(135deg, #D4A94A, #C49A3A)",
                  color: "#0D0D0F",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  opacity: !email.trim() || mutation.isPending ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {mutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <span>Send Reset Link</span> <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          // Success state
          <>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Mail size={24} color="#22C55E" />
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  color: "#F9F3E8",
                  marginBottom: 10,
                }}
              >
                Check your email
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#8A8A9A",
                  lineHeight: 1.6,
                  marginBottom: 8,
                }}
              >
                If <span style={{ color: "#F9F3E8" }}>{email}</span> is
                registered, we've sent a password reset link.
              </p>
              <p style={{ fontSize: 12, color: "#5A5A6A", marginBottom: 24 }}>
                The link expires in 15 minutes.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 24px",
                  borderRadius: 4,
                  border: "none",
                  background: "linear-gradient(135deg, #D4A94A, #C49A3A)",
                  color: "#0D0D0F",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
