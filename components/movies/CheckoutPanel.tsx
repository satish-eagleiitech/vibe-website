"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ChevronRight, CircleHelp, Ticket } from "lucide-react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { Container } from "@/components/common/Container";
import { BookingTermsModal } from "@/components/movies/BookingTermsModal";
import { buildSeatMap, findShowtime } from "@/lib/data/booking";
import { findFnBItems } from "@/lib/data/movieFnB";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { formatInr } from "@/lib/format";
import type { MovieDetails } from "@/types/movie";

type CheckoutPanelProps = {
  movie: MovieDetails;
  theatreId: string;
  showId: string;
  dateIso: string;
  seatIds: string[];
  language?: string;
  food?: string;
};

type Offer = {
  id: string;
  brand: string;
  mark: string;
  title: string;
  detail: string;
  tone: string;
};

const OFFERS: Offer[] = [
  {
    id: "visa",
    brand: "VISA",
    mark: "V",
    title: "10% off with Visa",
    detail: "Up to ₹150 off on movie tickets. Min cart ₹500.",
    tone: "bg-[#1A1F71] text-white",
  },
  {
    id: "upi",
    brand: "UPI",
    mark: "U",
    title: "Flat ₹50 off on UPI",
    detail: "Valid once per user this week.",
    tone: "bg-gradient-to-br from-[#FF6B35] to-[#F7C948] text-white",
  },
  {
    id: "hdfc",
    brand: "HDFC",
    mark: "H",
    title: "HDFC Debit Card",
    detail: "Get ₹100 cashback on spends above ₹799.",
    tone: "bg-gradient-to-br from-[#004C8F] to-[#00A3E0] text-white",
  },
  {
    id: "vybe",
    brand: "VYBE",
    mark: "★",
    title: "Scratch card boost",
    detail: "Book now and unlock an extra Rewards scratch.",
    tone: "bg-accent text-white",
  },
];

function formatDateLabel(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00`);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function parseFood(food?: string) {
  if (!food) return [] as { id: string; qty: number }[];
  return food
    .split(",")
    .map((part) => {
      const [id, qty] = part.split(":");
      return { id: id?.trim() ?? "", qty: Number(qty) || 0 };
    })
    .filter((item) => item.id && item.qty > 0);
}

export function CheckoutPanel({
  movie,
  theatreId,
  showId,
  dateIso,
  seatIds,
  language,
  food,
}: CheckoutPanelProps) {
  const { theatre, show } = findShowtime(
    movie.id,
    theatreId,
    showId,
    dateIso,
  );
  const map = buildSeatMap(showId);
  const seats = map.seats.filter((seat) => seatIds.includes(seat.id));
  const foodLines = parseFood(food);
  const foodItems = findFnBItems(foodLines.map((item) => item.id));
  const foodTotal = foodLines.reduce((sum, line) => {
    const item = foodItems.find((entry) => entry.id === line.id);
    return sum + (item ? item.price * line.qty : 0);
  }, 0);
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees + foodTotal;
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const [name, setName] = useState("Vamshi");
  const [phone, setPhone] = useState("+91 9347190965");
  const [termsOpen, setTermsOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const [offerId, setOfferId] = useState<string | null>(null);

  const langMeta =
    language ??
    movie.languages
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(", ");
  const meta = [
    langMeta ? langMeta.charAt(0).toUpperCase() + langMeta.slice(1) : "All",
    show?.format || "2D",
    movie.certification,
  ]
    .filter(Boolean)
    .join(" | ");

  if (!theatre || !show || !seats.length) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-extrabold text-text">Booking incomplete</h1>
        <p className="mt-2 text-text-secondary">
          Pick a showtime and seats again to checkout.
        </p>
        <Link
          href={`/movies/${movie.id}/book`}
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
        >
          Back to showtimes
        </Link>
      </Container>
    );
  }

  function confirmPay() {
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "movies",
      title: movie.title,
      posterUrl: movie.posterUrl,
      meta,
      dateLabel: formatDateLabel(dateIso),
      timeLabel: show!.label,
      venue: `${theatre!.name}${theatre!.area ? `: ${theatre!.area}` : ""}`,
      seats: seats.map((seat) => seat.id),
      audi: "AUDI 8",
      format: show!.format,
      language: language || movie.languages[0],
      certification: movie.certification,
      ticketPrice: subtotal,
      convenienceFee: fees,
      seatClass: seats[0]?.category || "CLASSIC",
      theatreName: theatre!.name,
      paymentMethod: "UPI",
      total,
      createdAt: new Date().toISOString(),
    };
    saveBooking(next);
    setBooking(next);
  }

  if (booking) {
    return <BookingConfirmed booking={booking} />;
  }

  return (
    <div className="w-full pb-16">
      <BookingTermsModal
        open={termsOpen}
        mode="view"
        onClose={() => setTermsOpen(false)}
      />
      {offersOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close offers"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOffersOpen(false)}
          />
          <div className="relative z-[1] max-h-[72svh] w-full max-w-[400px] overflow-hidden rounded-t-[20px] border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:rounded-[20px]">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-[16px] font-extrabold text-text">Offers for you</h2>
            </div>
            <ul className="hide-scrollbar max-h-[48svh] space-y-2.5 overflow-y-auto px-4 pb-2">
              {OFFERS.map((offer) => {
                const active = offerId === offer.id;
                return (
                  <li key={offer.id}>
                    <button
                      type="button"
                      onClick={() => setOfferId(active ? null : offer.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        active
                          ? "border-accent bg-accent-soft"
                          : "border-border bg-surface hover:bg-surface-muted"
                      }`}
                    >
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-full text-[13px] font-black shadow-sm ${offer.tone}`}
                      >
                        {offer.mark}
                      </span>
                      <span className="min-w-0">
                        <span className="text-[11px] font-bold tracking-[0.08em] text-text-muted uppercase">
                          {offer.brand}
                        </span>
                        <span className="mt-0.5 block text-[14px] font-extrabold text-text">
                          {offer.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-text-secondary">
                          {offer.detail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={() => setOffersOpen(false)}
                className="w-full rounded-full bg-accent py-2.5 text-[13px] font-extrabold text-white"
              >
                {offerId ? "Apply offer" : "Close"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Container className="py-8 md:py-12">
        <div className="mb-8">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-accent uppercase">
            Checkout
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold text-text md:text-[36px]">
            Confirm your seats
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Ticket className="size-5" />
                </span>
                <div>
                  <h2 className="text-[18px] font-extrabold text-text">
                    {movie.title}
                  </h2>
                  <p className="mt-1 text-[14px] text-text-secondary">
                    {dateIso} · {show.label} · {show.format}
                  </p>
                  <p className="mt-1 text-[14px] text-text-secondary">
                    {theatre.name}
                    {theatre.area ? `, ${theatre.area}` : ""}
                  </p>
                  <p className="mt-3 text-[14px] font-bold text-text">
                    Seats: {seats.map((s) => s.id).join(", ")}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
              <h3 className="text-[16px] font-extrabold text-text">
                Contact details
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-[13px] font-semibold text-text-secondary">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none focus:border-accent"
                  />
                </label>
                <label className="block text-[13px] font-semibold text-text-secondary">
                  Phone
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm font-semibold text-text outline-none focus:border-accent"
                  />
                </label>
              </div>
            </section>

            <div>
              <p className="mb-2 text-[14px] font-extrabold text-text">Offers for you</p>
              <div className="grid gap-2.5 sm:grid-cols-[1.45fr_1fr]">
                <button
                  type="button"
                  onClick={() => setOffersOpen(true)}
                  className="flex items-center justify-center gap-3 rounded-full border border-border bg-gradient-to-r from-[#fff0f6] via-white to-[#eef6ff] px-4 py-3 text-left shadow-[0_4px_16px_rgba(255,0,91,0.08)] transition-transform hover:scale-[1.01] dark:from-[#2a1220] dark:via-surface dark:to-[#122033]"
                >
                  <span className="flex -space-x-2.5">
                    {OFFERS.map((offer) => (
                      <span
                        key={offer.id}
                        className={`grid size-8 place-items-center rounded-full border-2 border-white text-[11px] font-black shadow-sm dark:border-[#1a1a1f] ${offer.tone}`}
                      >
                        {offer.mark}
                      </span>
                    ))}
                  </span>
                  <span className="truncate text-[13px] font-extrabold text-text">
                    {offerId
                      ? OFFERS.find((item) => item.id === offerId)?.title
                      : `See all ${OFFERS.length} offers`}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-text-muted" />
                </button>

                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-accent/40"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <CircleHelp className="size-4 text-text-muted" />
                    <span className="text-[13px] font-extrabold text-text">
                      Terms and conditions
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-text-muted" />
                </button>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-5 md:p-6">
            <h3 className="text-[16px] font-extrabold text-text">
              Order summary
            </h3>
            <dl className="mt-4 space-y-3 text-[14px]">
              <div className="flex justify-between text-text-secondary">
                <dt>Tickets ({seats.length})</dt>
                <dd className="font-semibold text-text">
                  {formatInr(subtotal)}
                </dd>
              </div>
              {foodLines.length ? (
                <div className="flex justify-between text-text-secondary">
                  <dt>Food & beverages</dt>
                  <dd className="font-semibold text-text">
                    {formatInr(foodTotal)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between text-text-secondary">
                <dt>Convenience fee</dt>
                <dd className="font-semibold text-text">{formatInr(fees)}</dd>
              </div>
              {offerId ? (
                <div className="flex justify-between text-emerald-600">
                  <dt>Offer applied</dt>
                  <dd className="font-semibold">
                    {OFFERS.find((item) => item.id === offerId)?.brand}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-border pt-3 text-text">
                <dt className="font-extrabold">Total</dt>
                <dd className="text-[18px] font-extrabold">{formatInr(total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={confirmPay}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
            >
              <CheckCircle2 className="size-4" />
              Pay {formatInr(total)}
            </button>
            <Link
              href={`/movies/${movie.id}/food?theatre=${theatreId}&show=${showId}&date=${dateIso}&seats=${seatIds.join(",")}${language ? `&lang=${language}` : ""}`}
              className="mt-3 block text-center text-sm font-semibold text-text-secondary hover:text-accent"
            >
              Edit food
            </Link>
          </aside>
        </div>
      </Container>
    </div>
  );
}
