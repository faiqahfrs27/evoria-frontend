import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Minus,
  Plus,
  Ticket,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../lib/axios";
import type { Event } from "../types/event";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price || 0);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatTime = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getVoucherDiscount = (voucher: any) => {
  return (
    voucher.discountAmount ??
    voucher.discount ??
    voucher.discountValue ??
    voucher.value ??
    0
  );
};

function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const [activeTab, setActiveTab] = useState<"description" | "tickets">(
    "description",
  );

  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(
    null,
  );

  const {
    data: event,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event-detail", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Event>(`/events/${slug}`);
      return data;
    },
    enabled: Boolean(slug),
    retry: false,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/profile");
      return data.data;
    },
    retry: false,
  });

  const isFreeEvent = Boolean(event?.isFree || event?.price === 0);

  const totalPrice = useMemo(() => {
    if (!event || event.isFree || event.price === 0) return 0;

    return (event.ticketTypes ?? []).reduce((total, ticket) => {
      const qty = selectedTickets[ticket.id] || 0;
      return total + qty * ticket.price;
    }, 0);
  }, [event, selectedTickets]);

  const selectedVoucher = useMemo(() => {
    return (event?.vouchers ?? []).find(
      (voucher) => voucher.id === selectedVoucherId,
    );
  }, [event?.vouchers, selectedVoucherId]);

  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher) return 0;
    return getVoucherDiscount(selectedVoucher);
  }, [selectedVoucher]);

  const priceAfterVoucher = Math.max(0, totalPrice - voucherDiscount);

  const pointBalance = profile?.pointBalance ?? 0;

  const pointUsed = usePoints ? Math.min(pointBalance, priceAfterVoucher) : 0;

  const finalPrice = Math.max(0, priceAfterVoucher - pointUsed);

  const totalQty = Object.values(selectedTickets).reduce(
    (total, qty) => total + qty,
    0,
  );

  const changeTicketQty = (ticketId: string, type: "plus" | "minus") => {
    setSelectedTickets((current) => {
      const currentQty = current[ticketId] || 0;
      const nextQty =
        type === "plus" ? currentQty + 1 : Math.max(0, currentQty - 1);

      return {
        ...current,
        [ticketId]: nextQty,
      };
    });
  };

  const handleCopyVoucher = async (voucherId: string, voucherCode: string) => {
    try {
      await navigator.clipboard.writeText(voucherCode);
      setCopiedVoucherId(voucherId);

      setTimeout(() => {
        setCopiedVoucherId(null);
      }, 1200);
    } catch (error) {
      console.error("Failed to copy voucher code:", error);
    }
  };

  const handleCheckout = async () => {
    if (!event) return;

    const selectedEntries = Object.entries(selectedTickets).filter(
      ([, quantity]) => quantity > 0,
    );

    if (!isFreeEvent && selectedEntries.length === 0) {
      toast.error("Please select at least one ticket.");
      return;
    }

    if (selectedEntries.length > 1) {
      toast.error("For now, please select only one ticket type.");
      return;
    }

    const [ticketTypeId, quantity] = selectedEntries[0] ?? [];

    try {
      setIsCheckingOut(true);

      const { data } = await axiosInstance.post("/transactions", {
        eventId: event.id,
        ticketTypeId: isFreeEvent ? undefined : ticketTypeId,
        quantity: String(isFreeEvent ? 1 : quantity),
        voucherId: selectedVoucherId || undefined,
        pointUsed: String(pointUsed),
      });

      toast.success("Transaction created successfully.");

      navigate(`/transactions/${data.data.id}/payment`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create transaction.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
          <div className="h-[360px] animate-pulse rounded-[1.1rem] bg-[#14141A]" />
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
        <Navbar />

        <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
          <div className="rounded-[1.1rem] border border-red-500/30 bg-red-950/20 p-8 text-red-200">
            <p className="font-semibold">Event detail failed to load.</p>
            <p className="mt-2 text-sm text-red-200/80">
              Please check whether the backend endpoint for this event detail is
              already working.
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

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F9F3E8]">
      <Navbar />

      <main className="mx-auto max-w-[1050px] px-6 pb-20 pt-28 lg:px-8">
        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D4A94A] transition hover:text-[#F5DFA0]"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <div className="grid gap-5 lg:grid-cols-[1fr_325px]">
          <section>
            <div className="overflow-hidden rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="h-[260px] w-full object-cover sm:h-[330px]"
                />
              ) : (
                <div className="h-[260px] w-full bg-[radial-gradient(circle_at_25%_25%,rgba(212,169,74,0.22),transparent_28%),linear-gradient(135deg,#14141A,#0D0D0F)] sm:h-[330px]" />
              )}
            </div>

            {(event.vouchers ?? []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {(event.vouchers ?? []).map((voucher) => {
                  const discount = getVoucherDiscount(voucher);
                  const isCopied = copiedVoucherId === voucher.id;
                  const isSelected = selectedVoucherId === voucher.id;

                  return (
                    <motion.div
                      key={voucher.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`min-w-[155px] rounded-[0.75rem] border p-3 transition ${
                        isSelected
                          ? "border-[#D4A94A] bg-[rgba(212,169,74,0.12)]"
                          : "border-[rgba(212,169,74,0.18)] bg-[#0D0D0F]/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#D4A94A]">
                            {voucher.code}
                          </p>

                          {discount > 0 && (
                            <p className="mt-1 text-xs font-semibold text-[#F9F3E8]">
                              {formatPrice(discount)}
                            </p>
                          )}
                        </div>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          animate={
                            isCopied
                              ? {
                                  scale: [1, 1.08, 1],
                                  borderColor: "rgba(212,169,74,0.75)",
                                  backgroundColor: "rgba(212,169,74,0.16)",
                                }
                              : {
                                  scale: 1,
                                  borderColor: "rgba(212,169,74,0.24)",
                                  backgroundColor: "rgba(212,169,74,0)",
                                }
                          }
                          transition={{ duration: 0.25 }}
                          onClick={() =>
                            handleCopyVoucher(voucher.id, voucher.code)
                          }
                          className="relative min-w-[58px] overflow-hidden rounded-sm border px-2 py-1 text-[10px] font-semibold text-[#D4A94A] transition hover:bg-[rgba(212,169,74,0.08)]"
                        >
                          <AnimatePresence mode="wait">
                            {isCopied ? (
                              <motion.span
                                key="copied"
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="block"
                              >
                                Copied!
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -8, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="block"
                              >
                                Copy
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>

                      {voucher.quota !== undefined && (
                        <p className="mt-2 text-xs text-[#8A8A9A]">
                          Quota: {voucher.quota}
                        </p>
                      )}

                      {voucher.startDate && voucher.endDate && (
                        <p className="mt-1 text-xs text-[#8A8A9A]">
                          Valid: {formatDate(voucher.startDate)} -{" "}
                          {formatDate(voucher.endDate)}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedVoucherId((current) =>
                            current === voucher.id ? null : voucher.id,
                          )
                        }
                        className="mt-3 w-full rounded-sm border border-[rgba(212,169,74,0.28)] px-3 py-1.5 text-xs font-semibold text-[#D4A94A] transition hover:bg-[rgba(212,169,74,0.08)]"
                      >
                        {isSelected ? "Selected" : "Use Voucher"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 rounded-[1rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/55 p-4">
              <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-sm border border-[rgba(212,169,74,0.14)] bg-[#2A2624] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`rounded-sm py-2 text-sm font-semibold transition ${
                    activeTab === "description"
                      ? "bg-[#0D0D0F] text-[#F9F3E8]"
                      : "text-[#B9B1A5] hover:text-[#F9F3E8]"
                  }`}
                >
                  Description
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tickets")}
                  className={`rounded-sm py-2 text-sm font-semibold transition ${
                    activeTab === "tickets"
                      ? "bg-[#0D0D0F] text-[#F9F3E8]"
                      : "text-[#B9B1A5] hover:text-[#F9F3E8]"
                  }`}
                >
                  Tickets
                </button>
              </div>

              {activeTab === "description" ? (
                <div className="space-y-5 text-sm leading-7 text-[#F9F3E8]">
                  <p className="whitespace-pre-line">
                    {event.description || "No description available."}
                  </p>

                  <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4 text-[#B9B1A5]">
                    <p className="mb-2 font-semibold text-[#F9F3E8]">
                      Event Information
                    </p>

                    <ul className="list-inside list-disc space-y-1">
                      <li>
                        Official ticket purchase is available through Evoria.
                      </li>
                      <li>One e-ticket is valid for one person.</li>
                      <li>Please keep your ticket until the event ends.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {isFreeEvent ? (
                    <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-5">
                      <h3 className="font-semibold text-[#F9F3E8]">
                        Free Entry
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#8A8A9A]">
                        This event is free. You can register without selecting a
                        paid ticket.
                      </p>
                    </div>
                  ) : (event.ticketTypes ?? []).length === 0 ? (
                    <div className="rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-5 text-sm text-[#8A8A9A]">
                      No ticket type available.
                    </div>
                  ) : (
                    (event.ticketTypes ?? []).map((ticket) => {
                      const qty = selectedTickets[ticket.id] || 0;

                      return (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between gap-4 rounded-[0.9rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F]/70 p-4"
                        >
                          <div>
                            <h3 className="font-semibold text-[#F9F3E8]">
                              {ticket.name}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-[#D4A94A]">
                              {formatPrice(ticket.price)}
                            </p>

                            <p className="mt-1 text-xs text-[#8A8A9A]">
                              Quota: {ticket.quota ?? "-"}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                changeTicketQty(ticket.id, "minus")
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.28)] text-[#D4A94A] transition hover:bg-[rgba(212,169,74,0.08)]"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-5 text-center text-sm font-semibold">
                              {qty}
                            </span>

                            <button
                              type="button"
                              onClick={() => changeTicketQty(ticket.id, "plus")}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,169,74,0.28)] text-[#D4A94A] transition hover:bg-[rgba(212,169,74,0.08)]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
              <h1 className="mb-6 text-xl font-bold leading-7 text-[#F9F3E8]">
                {event.name}
              </h1>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#D4A94A]" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-[#D4A94A]" />
                  <span>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#D4A94A]" />
                  <span>
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-[rgba(212,169,74,0.14)] pt-5">
                <div>
                  <p className="text-xs text-[#8A8A9A]">Organizer</p>

                  {event.organizer?.id ? (
                    <Link
                      to={`/organizers/${event.organizer.id}`}
                      className="mt-2 flex w-fit items-center gap-2 rounded-full border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 px-2.5 py-1.5 transition hover:border-[rgba(212,169,74,0.4)] hover:bg-[rgba(212,169,74,0.08)]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]">
                        {event.organizer.profilePic ? (
                          <img
                            src={event.organizer.profilePic}
                            alt={event.organizer.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-[#D4A94A]">
                            {(event.organizer.name || "O")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <span className="text-sm font-semibold text-[#F9F3E8]">
                        {event.organizer.name || "Organizer"}
                      </span>
                    </Link>
                  ) : (
                    <div className="mt-2 flex w-fit items-center gap-2 rounded-full border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 px-2.5 py-1.5">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,169,74,0.28)] bg-[#0D0D0F]">
                        <span className="text-xs font-bold text-[#D4A94A]">
                          {(event.organizer?.name || "O")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-[#F9F3E8]">
                        {event.organizer?.name || "Organizer"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[1.1rem] border border-[rgba(212,169,74,0.14)] bg-[#0D0D0F] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
              {isFreeEvent ? (
                <div className="mb-5 flex gap-4">
                  <Ticket size={34} className="text-[#D4A94A]" />
                  <p className="text-sm leading-6 text-[#F9F3E8]">
                    This is a free event. You can register without selecting a
                    paid ticket.
                  </p>
                </div>
              ) : totalQty === 0 ? (
                <div className="mb-5 flex gap-4">
                  <Ticket size={34} className="text-[#D4A94A]" />
                  <p className="text-sm leading-6 text-[#F9F3E8]">
                    You haven’t selected any tickets. Please choose one first in
                    the{" "}
                    <span className="font-semibold text-[#D4A94A]">
                      Tickets
                    </span>{" "}
                    tab.
                  </p>
                </div>
              ) : (
                <div className="mb-5 flex gap-4">
                  <Ticket size={34} className="text-[#D4A94A]" />
                  <p className="text-sm leading-6 text-[#F9F3E8]">
                    You selected{" "}
                    <span className="font-semibold text-[#D4A94A]">
                      {totalQty}
                    </span>{" "}
                    ticket(s).
                  </p>
                </div>
              )}

              <div className="border-t border-[rgba(212,169,74,0.14)] pt-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-[#B9B1A5]">Total price</span>
                  <span className="text-lg font-bold text-[#F9F3E8]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {selectedVoucher && (
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-[#B9B1A5]">
                      Voucher ({selectedVoucher.code})
                    </span>
                    <span className="font-semibold text-[#D4A94A]">
                      - {formatPrice(voucherDiscount)}
                    </span>
                  </div>
                )}

                <div className="mb-3 rounded-[0.75rem] border border-[rgba(212,169,74,0.14)] bg-[#14141A]/70 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#F9F3E8]">
                        Use points
                      </p>
                      <p className="mt-1 text-xs text-[#8A8A9A]">
                        Balance: {formatPrice(pointBalance)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUsePoints((current) => !current)}
                      disabled={pointBalance <= 0 || priceAfterVoucher <= 0}
                      className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        usePoints ? "bg-[#D4A94A]" : "bg-[#3A342E]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-[#0D0D0F] transition ${
                          usePoints ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {usePoints && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-[#B9B1A5]">Points used</span>
                      <span className="font-semibold text-[#D4A94A]">
                        - {formatPrice(pointUsed)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-5 flex items-center justify-between text-sm">
                  <span className="text-[#B9B1A5]">Final price</span>
                  <span className="text-lg font-bold text-[#F9F3E8]">
                    {formatPrice(finalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || (!isFreeEvent && totalQty === 0)}
                  className="h-11 w-full rounded-sm bg-[#D4A94A] text-sm font-bold text-[#0D0D0F] transition hover:bg-[#E8C97A] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isCheckingOut
                    ? "Processing..."
                    : isFreeEvent
                      ? "Register Free"
                      : "Checkout"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EventDetail;
