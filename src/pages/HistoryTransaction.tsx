import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  ArrowLeft,
  Star,
  Upload,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { axiosInstance } from "../lib/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  WAITING_FOR_PAYMENT: {
    label: "Waiting Payment",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    icon: <Clock size={12} />,
  },
  WAITING_FOR_ADMIN_CONFIRMATION: {
    label: "Awaiting Confirmation",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    icon: <AlertCircle size={12} />,
  },
  DONE: {
    label: "Completed",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    icon: <CheckCircle size={12} />,
  },
  REJECTED: {
    label: "Rejected",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    icon: <XCircle size={12} />,
  },
  EXPIRED: {
    label: "Expired",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    icon: <Clock size={12} />,
  },
  CANCELED: {
    label: "Canceled",
    color: "#9CA3AF",
    bg: "rgba(156,163,175,0.08)",
    icon: <XCircle size={12} />,
  },
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
          }}
        >
          <Star
            size={24}
            fill={(hovered || value) >= n ? "#D4A94A" : "transparent"}
            color={(hovered || value) >= n ? "#D4A94A" : "#5A5A6A"}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ event, onClose }: { event: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      axiosInstance.post(`/reviews`, { eventId: event.id, rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      qc.invalidateQueries({ queryKey: ["my-transactions"] });
      onClose();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || "Failed to submit review"),
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
          borderRadius: 8,
          padding: 28,
          maxWidth: 440,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              color: "#F9F3E8",
            }}
          >
            Write a Review
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8A8A9A",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            padding: "12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 6,
          }}
        >
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt=""
              style={{
                width: 44,
                height: 44,
                borderRadius: 4,
                objectFit: "cover",
              }}
            />
          )}
          <div>
            <p style={{ fontSize: 13, color: "#F9F3E8", fontWeight: 500 }}>
              {event.name}
            </p>
            <p style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>
              {event.location}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <p
              style={{
                fontSize: 10,
                color: "#8A8A9A",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Rating
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                color: "#8A8A9A",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Comment (optional)
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 4,
                border: "1px solid rgba(212,169,74,0.2)",
                background: "#1C1C22",
                color: "#F9F3E8",
                fontSize: 13,
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
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
              disabled={rating === 0 || mutation.isPending}
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
                opacity: rating === 0 || mutation.isPending ? 0.5 : 1,
              }}
            >
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Proof Modal ───────────────────────────────────────────────────────
function UploadProofModal({
  transactionId,
  onClose,
}: {
  transactionId: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("paymentProof", file!);
      return axiosInstance.patch(
        `/transactions/${transactionId}/payment-proof`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    },
    onSuccess: () => {
      toast.success("Payment proof uploaded!");
      qc.invalidateQueries({ queryKey: ["my-transactions"] });
      onClose();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || "Failed to upload"),
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
          borderRadius: 8,
          padding: 28,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20,
              color: "#F9F3E8",
            }}
          >
            Upload Payment Proof
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8A8A9A",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "24px",
              borderRadius: 6,
              border: "2px dashed rgba(212,169,74,0.25)",
              cursor: "pointer",
              background: file ? "rgba(212,169,74,0.04)" : "transparent",
            }}
          >
            <Upload size={24} color="#D4A94A" />
            <p style={{ fontSize: 12, color: "#8A8A9A" }}>
              {file ? file.name : "Click to upload payment proof"}
            </p>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
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
              disabled={!file || mutation.isPending}
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
                opacity: !file || mutation.isPending ? 0.5 : 1,
              }}
            >
              {mutation.isPending ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Transaction Card ─────────────────────────────────────────────────────────
function TransactionCard({ tx }: { tx: any }) {
  const [reviewModal, setReviewModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const status = statusConfig[tx.status] ?? statusConfig.CANCELED;
  const eventEnded =
    tx.event?.endDate && new Date() > new Date(tx.event.endDate);
  const canReview = tx.status === "DONE" && eventEnded;
  const canUpload = tx.status === "WAITING_FOR_PAYMENT" && !tx.paymentProof;

  return (
    <>
      <div
        style={{
          background: "#12121A",
          border: "1px solid rgba(212,169,74,0.1)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Event info */}
        <div
          style={{
            display: "flex",
            gap: 14,
            padding: "16px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {tx.event?.imageUrl && (
            <img
              src={tx.event.imageUrl}
              alt=""
              style={{
                width: 56,
                height: 56,
                borderRadius: 6,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link
              to={`/events/${tx.event?.slug}`}
              style={{
                fontSize: 14,
                color: "#F9F3E8",
                fontWeight: 500,
                textDecoration: "none",
                display: "block",
                marginBottom: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tx.event?.name}
            </Link>
            <p style={{ fontSize: 11, color: "#8A8A9A", marginBottom: 2 }}>
              {tx.event?.location}
            </p>
            <p style={{ fontSize: 10, color: "#5A5A6A" }}>
              {tx.event?.startDate && fmtDate(tx.event.startDate)}
            </p>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 3,
              background: status.bg,
              color: status.color,
              fontSize: 10,
              fontWeight: 500,
              flexShrink: 0,
              height: "fit-content",
            }}
          >
            {status.icon} {status.label}
          </span>
        </div>

        {/* Details */}
        <div
          style={{
            padding: "12px 18px",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>
              <p
                style={{
                  fontSize: 9,
                  color: "#5A5A6A",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Ticket
              </p>
              <p style={{ fontSize: 12, color: "#F9F3E8" }}>
                {tx.ticketType?.name ?? "General"} × {tx.quantity}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 9,
                  color: "#5A5A6A",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Total
              </p>
              <p style={{ fontSize: 12, color: "#D4A94A", fontWeight: 600 }}>
                {fmt(tx.finalPrice)}
              </p>
            </div>
            {tx.status === "WAITING_FOR_PAYMENT" && (
              <div>
                <p
                  style={{
                    fontSize: 9,
                    color: "#5A5A6A",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  Deadline
                </p>
                <p style={{ fontSize: 12, color: "#F59E0B" }}>
                  {fmtDate(tx.paymentDeadline)}
                </p>
              </div>
            )}
            <div>
              <p
                style={{
                  fontSize: 9,
                  color: "#5A5A6A",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Date
              </p>
              <p style={{ fontSize: 12, color: "#8A8A9A" }}>
                {fmtDate(tx.createdAt)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {canUpload && (
              <button
                onClick={() => setUploadModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 4,
                  border: "none",
                  background: "linear-gradient(135deg, #D4A94A, #C49A3A)",
                  color: "#0D0D0F",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Upload size={12} /> Upload Proof
              </button>
            )}
            {canReview && (
              <button
                onClick={() => setReviewModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 4,
                  border: "1px solid rgba(212,169,74,0.3)",
                  background: "transparent",
                  color: "#D4A94A",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                <Star size={12} /> Leave Review
              </button>
            )}
          </div>
        </div>
      </div>

      {reviewModal && (
        <ReviewModal event={tx.event} onClose={() => setReviewModal(false)} />
      )}
      {uploadModal && (
        <UploadProofModal
          transactionId={tx.id}
          onClose={() => setUploadModal(false)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  "All",
  "WAITING_FOR_PAYMENT",
  "WAITING_FOR_ADMIN_CONFIRMATION",
  "DONE",
  "REJECTED",
  "EXPIRED",
  "CANCELED",
];

export default function HistoryTransaction() {
  const [filter, setFilter] = useState("All");

  const { data: transactions = [], isPending } = useQuery({
    queryKey: ["my-transactions"],
    queryFn: async () =>
      (await axiosInstance.get("/profile/transactions")).data.data ?? [],
    retry: false,
  });

  const filtered =
    filter === "All"
      ? transactions
      : transactions.filter((tx: any) => tx.status === filter);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0F",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Navbar />
      <main
        style={{ maxWidth: 760, margin: "0 auto", padding: "100px 24px 60px" }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link
            to="/"
            style={{
              display: "block",
              fontSize: 11,
              color: "#8A8A9A",
              textDecoration: "none",
              letterSpacing: "0.08em",
              marginBottom: 20,
            }}
          >
            <ArrowLeft
              size={13}
              style={{ display: "inline", marginRight: 8 }}
            />{" "}
            Back to Home
          </Link>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#D4A94A",
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            My Account
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 34,
              fontWeight: 300,
              color: "#F9F3E8",
            }}
          >
            Transaction <span style={{ color: "#D4A94A" }}>History</span>
          </h1>
        </div>

        {/* Filter */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {STATUS_FILTERS.map((s) => {
            const cfg = statusConfig[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 3,
                  border: `1px solid ${filter === s ? (cfg?.color ?? "#D4A94A") : "rgba(212,169,74,0.16)"}`,
                  background:
                    filter === s
                      ? `${cfg?.bg ?? "rgba(212,169,74,0.08)"}`
                      : "transparent",
                  color: filter === s ? (cfg?.color ?? "#D4A94A") : "#8A8A9A",
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s === "All" ? "All" : (statusConfig[s]?.label ?? s)}
              </button>
            );
          })}
        </div>

        {/* List */}
        {isPending ? (
          <div
            style={{
              background: "#12121A",
              border: "1px solid rgba(212,169,74,0.1)",
              borderRadius: 8,
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#5A5A6A", fontSize: 13 }}>
              Loading transactions...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: "#12121A",
              border: "1px solid rgba(212,169,74,0.1)",
              borderRadius: 8,
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#5A5A6A", fontSize: 13 }}>
              No transactions found.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((tx: any) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
