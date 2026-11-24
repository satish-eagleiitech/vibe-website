"use client";

import Image from "next/image";
import { Armchair, ScanLine } from "lucide-react";
import { TicketQr } from "@/components/bookings/TicketQr";
import type { BookingCategory, VybeBooking } from "@/lib/bookings/storage";

const SCAN_PLACE: Record<BookingCategory, string> = {
  movies: "at the cinema entrance",
  events: "at the gate",
  play: "at the venue desk",
  activities: "at the entry counter",
};

type TicketPassProps = {
  booking: VybeBooking;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatBookedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function shortId(booking: VybeBooking) {
  const raw = (booking.bookingCode || booking.id).replace(/\s/g, "");
  return raw.slice(-7).toUpperCase();
}

function NotchDivider() {
  return (
    <div className="relative">
      <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-bg" />
      <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-bg" />
      <div className="mx-4 border-t border-dashed border-border" />
    </div>
  );
}

/** Compact confirmed ticket — designed to fit in one screen with confirmation chrome. */
export function TicketPass({ booking }: TicketPassProps) {
  const language = booking.language
    ? booking.language.charAt(0).toUpperCase() + booking.language.slice(1)
    : "";
  const title = language ? `${booking.title} (${language})` : booking.title;
  const ticketPrice =
    booking.ticketPrice ?? Math.max(0, booking.total - (booking.convenienceFee ?? 0));
  const fees = booking.convenienceFee ?? 0;
  const seatLabel = booking.seatClass
    ? `${booking.seatClass} - ${booking.seats.join(", ")}`
    : booking.seats.join(", ");
  const brand = (booking.theatreName || booking.venue).toUpperCase();
  const qty = Math.max(1, booking.seats.length || 1);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
        <div className="relative h-[108px] w-[72px] shrink-0 overflow-hidden rounded-md bg-surface-muted sm:h-[120px] sm:w-[80px]">
          <Image
            src={booking.posterUrl}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] leading-snug font-extrabold text-text sm:text-[16px]">
                {title}
              </h2>
              <p className="mt-0.5 text-[12px] font-semibold text-text-secondary">
                {booking.format || booking.meta}
              </p>
            </div>
            {booking.category === "movies" ? (
              <span className="shrink-0 text-[11px] font-medium text-text-muted">M-Ticket</span>
            ) : null}
          </div>

          <p className="mt-2 text-[13px] font-extrabold text-text">
            {booking.dateLabel} | {booking.timeLabel}
          </p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-text-secondary">
            {booking.venue}
          </p>
          <p className="mt-1.5 text-[12px] font-semibold text-text-secondary">Quantity: {qty}</p>
          <p className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[12px] font-extrabold text-text">
            <Armchair className="size-3.5 shrink-0 text-text-secondary" />
            <span className="truncate">{seatLabel}</span>
          </p>
          <p className="mt-0.5 truncate text-[10px] font-bold tracking-wide text-text-muted uppercase">
            {brand}
          </p>
        </div>
      </div>

      <NotchDivider />

      <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
        <div className="shrink-0 rounded-xl border border-border bg-white p-1.5">
          <TicketQr value={booking.bookingCode || booking.id} className="size-[88px] sm:size-[96px]" />
        </div>
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 text-[13px] font-extrabold text-text">
            <ScanLine className="size-3.5 text-text-secondary" />
            Show this QR {SCAN_PLACE[booking.category]}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-text-secondary">
            Staff will scan it at entry. A screenshot works — raise brightness.
          </p>
          <p className="mt-2 inline-block rounded-md border border-dashed border-border px-2 py-1 font-mono text-[11px] font-bold tracking-wider text-text">
            {shortId(booking)}
          </p>
        </div>
      </div>

      <NotchDivider />

      <div className="space-y-1.5 px-4 py-2.5 text-[12px] sm:px-5">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Ticket price</span>
          <span className="font-semibold text-text">{money(ticketPrice)}</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-text-secondary">
            <span>Convenience fees</span>
            <span className="font-semibold text-text">{money(fees)}</span>
          </div>
          <p className="text-[10px] text-text-muted">Incl. of Tax</p>
        </div>
        <div className="flex items-end justify-between border-t border-border pt-2">
          <span className="text-[13px] font-extrabold text-text">Amount Paid</span>
          <span className="text-[18px] font-extrabold tracking-tight text-text">
            {money(booking.total)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-surface-muted px-4 py-2.5 sm:px-5">
        <div>
          <p className="text-[9px] font-bold tracking-wide text-text-muted uppercase">
            Booked at
          </p>
          <p className="mt-0.5 text-[10px] leading-snug font-semibold text-text sm:text-[11px]">
            {formatBookedAt(booking.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-wide text-text-muted uppercase">
            Payment
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-text sm:text-[11px]">
            {booking.paymentMethod || "UPI"}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-wide text-text-muted uppercase">
            Booking ID
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-text sm:text-[11px]">
            {shortId(booking)}
          </p>
        </div>
      </div>
    </article>
  );
}
