"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Ticket } from "lucide-react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { Container } from "@/components/common/Container";
import { buildSeatMap, findShowtime } from "@/lib/data/booking";
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
};

function formatDateLabel(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00`);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CheckoutPanel({
  movie,
  theatreId,
  showId,
  dateIso,
  seatIds,
}: CheckoutPanelProps) {
  const { theatre, show } = findShowtime(
    movie.id,
    theatreId,
    showId,
    dateIso,
  );
  const map = buildSeatMap(showId);
  const seats = map.seats.filter((seat) => seatIds.includes(seat.id));
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees;
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const [name, setName] = useState("Vamshi");
  const [phone, setPhone] = useState("+91 9347190965");

  const meta = useMemo(() => {
    const languages = movie.languages
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(", ");
    return [languages || "All", show?.format || "2D", movie.certification]
      .filter(Boolean)
      .join(" | ");
  }, [movie, show]);

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
      language: movie.languages[0],
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
              <div className="flex justify-between text-text-secondary">
                <dt>Convenience fee</dt>
                <dd className="font-semibold text-text">{formatInr(fees)}</dd>
              </div>
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
              href={`/movies/${movie.id}/seats?theatre=${theatreId}&show=${showId}&date=${dateIso}`}
              className="mt-3 block text-center text-sm font-semibold text-text-secondary hover:text-accent"
            >
              Edit seats
            </Link>
          </aside>
        </div>
      </Container>
    </div>
  );
}
