import { useQuery } from "@tanstack/react-query";
import { Clock, Ticket, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";
import Footer from "../components/Footer";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price || 0);
};

const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

function Payment() {
  const { transactionId } = useParams();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const {
    data: transaction,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transaction-detail", transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/transactions/${transactionId}`,
      );
      return data.data;
    },
    enabled: Boolean(transactionId),
    retry: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remainingTime = useMemo(() => {
    if (!transaction?.paymentDeadline) return "-";

    const deadline = new Date(transaction.paymentDeadline).getTime();
    const distance = deadline - now;

    if (distance <= 0) return "Expired";

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }, [transaction?.paymentDeadline, now]);

  const handleUploadPaymentProof = async () => {
    if (!paymentProof) {
      toast.error("Please choose your payment proof first.");
      return;
    }

    const formData = new FormData();
    formData.append("paymentProof", paymentProof);

    try {
      setIsUploading(true);

      await axiosInstance.patch(
        `/transactions/${transactionId}/payment-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Payment proof uploaded.");
      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to upload payment proof.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!transaction?.event?.id) {
      toast.error("Event data is missing.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    try {
      setIsSubmittingReview(true);

      await axiosInstance.post("/reviews", {
        eventId: transaction.event.id,
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("Review submitted successfully.");
      setReviewSubmitted(true);
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />
        <main className="mx-auto max-w-[950px] px-6 pb-20 pt-28 lg:px-8">
          <div className="h-[360px] animate-pulse rounded-[1.1rem] bg-[#14141A]" />
        </main>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />
        <main className="mx-auto max-w-[950px] px-6 pb-20 pt-28 lg:px-8">
          <div className="rounded-[1.1rem] border border-red-500/30 bg-red-950/20 p-8 text-red-200">
            <p className="font-semibold">Transaction failed to load.</p>
            <p className="mt-2 text-sm text-red-200/80">
              Please make sure GET /transactions/:id already exists in your
              backend.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-sm border border-red-300/40 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const canUpload = transaction.status === "WAITING_FOR_PAYMENT";

  const eventHasEnded = transaction.event?.endDate
    ? new Date(transaction.event.endDate) < new Date()
    : false;

  const canWriteReview =
    transaction.status === "DONE" && eventHasEnded && !reviewSubmitted;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
      <Navbar />

      <main className="mx-auto max-w-[950px] px-6 pb-20 pt-28 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4A94A]">
            Payment
          </p>
          <h1 className="mt-2 text-2xl font-bold">Complete Your Payment</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#B9B1A5]">
            Upload your payment proof before the deadline. After the proof is
            uploaded, the transaction will wait for organizer confirmation.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
          <section className="rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 p-5">
            <div className="overflow-hidden rounded-[1rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]">
              {transaction.event?.imageUrl ? (
                <img
                  src={transaction.event.imageUrl}
                  alt={transaction.event.name}
                  className="h-[220px] w-full object-cover"
                />
              ) : (
                <div className="h-[220px] w-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,169,74,0.22),transparent_28%),linear-gradient(135deg,#14141A,#0D0D0F)]" />
              )}
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold">{transaction.event?.name}</h2>
              <p className="mt-2 text-sm text-[#B9B1A5]">
                {transaction.event?.location}
              </p>
            </div>

            <div className="mt-5 rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4">
              <div className="flex items-center gap-3">
                <Ticket size={20} className="text-[#D4A94A]" />
                <div>
                  <p className="font-semibold">
                    {transaction.ticketType?.name || "Free Entry"}
                  </p>
                  <p className="mt-1 text-sm text-[#8A8A9A]">
                    Quantity: {transaction.quantity}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4">
              <p className="text-sm text-[#B9B1A5]">Transaction Status</p>
              <p className="mt-1 font-bold text-[#D4A94A]">
                {transaction.status}
              </p>
            </div>

            {canWriteReview && (
              <div className="mt-5 rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4">
                <p className="text-sm font-semibold text-[#F9F3E8]">
                  Write a Review
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8A8A9A]">
                  Share your experience after attending this event.
                </p>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-[#B9B1A5]">
                    Rating
                  </label>

                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`text-2xl transition ${
                          value <= rating ? "text-[#D4A94A]" : "text-[#4A4038]"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-[#B9B1A5]">
                    Comment
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="mt-2 w-full resize-none rounded-sm border border-[rgba(212,169,74,0.18)] bg-[#14141A] px-3 py-2 text-sm text-[#F9F3E8] outline-none transition placeholder:text-[#6F6A63] focus:border-[#D4A94A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="mt-4 h-11 w-full rounded-sm bg-[#D4A94A] text-sm font-bold text-[#0D0D0F] transition hover:bg-[#E8C97A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

            {reviewSubmitted && (
              <div className="mt-5 rounded-[0.9rem] border border-green-500/20 bg-green-950/20 p-4 text-sm text-green-200">
                Thank you. Your review has been submitted.
              </div>
            )}

            {canUpload && (
              <div className="mt-5 rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4">
                <label className="text-sm font-semibold">
                  Upload payment proof
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="mt-3 block w-full text-sm text-[#B9B1A5] file:mr-4 file:rounded-sm file:border-0 file:bg-[#D4A94A] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#0D0D0F]"
                />

                <button
                  type="button"
                  onClick={handleUploadPaymentProof}
                  disabled={isUploading}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-sm bg-[#D4A94A] px-5 text-sm font-bold text-[#0D0D0F] transition hover:bg-[#E8C97A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload Proof"}
                </button>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,169,74,0.28)] bg-[rgba(212,169,74,0.08)]">
                <Clock size={18} className="text-[#D4A94A]" />
              </div>

              <div>
                <p className="text-xs text-[#8A8A9A]">Remaining time</p>
                <p className="font-bold text-[#F9F3E8]">{remainingTime}</p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#8A8A9A]">
              Deadline: {formatDateTime(transaction.paymentDeadline)}
            </p>

            <div className="mt-6 border-t border-[rgba(212,169,74,0.14)] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#B9B1A5]">Base price</span>
                <span>{formatPrice(transaction.basePrice)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[#B9B1A5]">Points used</span>
                <span>- {formatPrice(transaction.pointUsed)}</span>
              </div>

              {transaction.voucher && (
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#B9B1A5]">Voucher</span>
                  <span>{transaction.voucher.code}</span>
                </div>
              )}

              <div className="mt-5 flex justify-between border-t border-[rgba(212,169,74,0.14)] pt-5">
                <span className="font-semibold">Final price</span>
                <span className="text-lg font-bold text-[#D4A94A]">
                  {formatPrice(transaction.finalPrice)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Payment;
