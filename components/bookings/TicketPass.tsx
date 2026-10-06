"use client";

import Image from "next/image";
import { Armchair } from "lucide-react";
import type { VybeBooking } from "@/lib/bookings/storage";

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
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
  return `${datePart} ${timePart}`;
}

function NotchDivider() {
  return (
    <div className="relative my-1">
      <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full border border-border bg-bg" />
      <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full border border-border bg-bg" />
      <div className="mx-5 border-t border-dashed border-border" />
    </div>
  );
}

export function TicketPass({ booking }: TicketPassProps) {
  const language = booking.language
    ? booking.language.charAt(0).toUpperCase() + booking.language.slice(1)
    : "";
  const title = language ? `${booking.title} (${language})` : booking.title;
  const ticketPrice = booking.ticketPrice ?? booking.total;
  const fees = booking.convenienceFee ?? 0;
  const seatLabel = booking.seatClass
    ? `${booking.seatClass} - ${booking.seats.join(", ")}`
    : booking.seats.join(", ");
  const brand = (booking.theatreName || booking.venue).toUpperCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="flex gap-4 px-5 py-5 md:px-6">
        <div className="relative h-[132px] w-[88px] shrink-0 overflow-hidden rounded-md bg-surface-muted">
          <Image
            src={booking.posterUrl}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="88px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[16px] leading-snug font-extrabold text-text md:text-[18px]">
                {title}
              </h2>
              {booking.format ? (
                <p className="mt-0.5 text-[13px] font-semibold text-text-secondary">
                  {booking.format}
                </p>
              ) : (
                <p className="mt-0.5 text-[13px] font-semibold text-text-secondary">
                  {booking.meta}
                </p>
              )}
            </div>
            {booking.category === "movies" ? (
              <span className="shrink-0 text-[12px] font-medium text-text-muted">
                Pick Up
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-[14px] font-extrabold text-text">
            {booking.dateLabel} | {booking.timeLabel}
          </p>
          <p className="mt-1 text-[13px] font-medium text-text-secondary">
            {booking.venue}
          </p>
          <p className="mt-2 text-[13px] font-semibold text-text-secondary">
            {booking.seats.length}
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-text">
            <Armchair className="size-4 text-text-secondary" />
            {seatLabel}
          </p>
          <p className="mt-1 text-[11px] font-bold tracking-wide text-text-muted uppercase">
            {brand}
          </p>
        </div>
      </div>

      <NotchDivider />

      <div className="space-y-3 px-5 py-4 text-[14px] md:px-6">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Ticket price</span>
          <span className="font-semibold text-text">{money(ticketPrice)}</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-text-secondary">
            <span>Convenience fees</span>
            <span className="font-semibold text-text">{money(fees)}</span>
          </div>
          <p className="text-[11px] text-text-muted">Incl. of Tax</p>
        </div>
      </div>

      <NotchDivider />

      <div className="flex items-end justify-between px-5 py-4 md:px-6">
        <span className="text-[15px] font-extrabold text-text">Amount Paid</span>
        <span className="text-[22px] font-extrabold tracking-tight text-text">
          {money(booking.total)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 bg-surface-muted px-5 py-4 sm:grid-cols-3 md:px-6">
        <div>
          <p className="text-[10px] font-bold tracking-wide text-text-muted uppercase">
            Booking date & time
          </p>
          <p className="mt-1 text-[12px] font-semibold text-text">
            {formatBookedAt(booking.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-wide text-text-muted uppercase">
            Payment method
          </p>
          <p className="mt-1 text-[12px] font-semibold text-text">
            {booking.paymentMethod || "UPI"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-wide text-text-muted uppercase">
            Booking ID
          </p>
          <p className="mt-1 text-[12px] font-semibold break-all text-text">
            {booking.id}
          </p>
        </div>
      </div>
    </article>
  );
}
