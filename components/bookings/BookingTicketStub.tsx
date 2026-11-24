"use client";

import Image from "next/image";
import Link from "next/link";
import { Armchair, Ticket } from "lucide-react";
import type { VybeBooking } from "@/lib/bookings/storage";

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
  const d = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const t = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
  return `${d} ${t}`;
}

function shortId(booking: VybeBooking) {
  const raw = (booking.bookingCode || booking.id).replace(/\s/g, "");
  return raw.slice(-7).toUpperCase();
}

function seatLabel(booking: VybeBooking) {
  if (booking.seats.length === 0) return booking.meta || "—";
  return booking.seatClass
    ? `${booking.seatClass} - ${booking.seats.join(", ")}`
    : booking.seats.join(", ");
}

function ticketType(booking: VybeBooking) {
  if (booking.category === "movies") return "M-Ticket";
  if (booking.category === "events") return "E-Ticket";
  if (booking.category === "play") return "Slot pass";
  return "Entry pass";
}

/**
 * BookMyShow-style purchase history card:
 * poster | perforated cut | details + prices | footer meta
 */
export function BookingTicketStub({ booking }: { booking: VybeBooking }) {
  const ticketPrice =
    booking.ticketPrice ?? Math.max(0, booking.total - (booking.convenienceFee ?? 0));
  const fees = booking.convenienceFee ?? 0;
  const cancelled = (booking.status ?? "confirmed") === "cancelled";
  const qty = Math.max(1, booking.seats.length || 1);
  const formatLabel = booking.format || null;
  const screenLabel = booking.audi?.trim() || null;

  return (
    <article className="relative overflow-hidden rounded-lg border border-[#e5e5e5] bg-white dark:border-border dark:bg-surface">
      {/* Top-right action — matches BMS */}
      <Link
        href={`/tickets/${booking.id}`}
        className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded border border-accent px-2.5 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent-soft sm:top-4 sm:right-4 sm:text-[12px]"
      >
        <Ticket className="size-3.5" strokeWidth={2.25} />
        View Ticket
      </Link>

      <div className="flex flex-col sm:flex-row">
        {/* Poster */}
        <div className="flex shrink-0 justify-center px-4 pt-4 sm:self-stretch sm:justify-start sm:py-5 sm:pr-0 sm:pl-5">
          <div className="relative h-[220px] w-[148px] overflow-hidden rounded-md bg-surface-muted sm:h-full sm:min-h-[240px] sm:w-[160px]">
            <Image
              src={booking.posterUrl}
              alt={booking.title}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        </div>

        {/* Perforated vertical cut (desktop) */}
        <div aria-hidden className="relative mx-0 hidden w-5 shrink-0 self-stretch sm:block">
          <span className="absolute top-0 left-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f7f8] dark:bg-dash" />
          <span className="absolute bottom-0 left-1/2 size-[18px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#f7f7f8] dark:bg-dash" />
          <span className="absolute inset-y-3 left-1/2 border-l border-dashed border-[#d4d4d8] dark:border-border" />
        </div>

        {/* Details + pricing (single column under BMS layout) */}
        <div className="min-w-0 flex-1 px-4 pt-3 pb-4 sm:py-5 sm:pr-5 sm:pl-2">
          <div className="flex items-start justify-between gap-3 pr-0 sm:pr-36">
            <div className="min-w-0">
              <h2 className="text-[15px] leading-tight font-bold text-[#1a1a1a] dark:text-text sm:text-[16px]">
                {booking.title}
              </h2>
              {formatLabel ? (
                <p className="mt-0.5 text-[12px] text-[#6b7280] dark:text-text-secondary">
                  ({formatLabel})
                </p>
              ) : booking.meta ? (
                <p className="mt-0.5 text-[12px] text-[#6b7280] dark:text-text-secondary">
                  {booking.meta}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 text-[12px] text-[#9ca3af]">{ticketType(booking)}</span>
          </div>

          <p className="mt-3 text-[13px] font-bold text-[#1a1a1a] dark:text-text">
            {booking.dateLabel} | {booking.timeLabel}
          </p>
          <p className="mt-1 text-[12px] text-[#6b7280] dark:text-text-secondary">
            {booking.venue}
          </p>
          <p className="mt-2 text-[12px] text-[#6b7280] dark:text-text-secondary">
            Quantity: {qty}
          </p>
          <p className="mt-1 inline-flex max-w-full items-center gap-1.5 text-[12px] font-semibold text-[#1a1a1a] dark:text-text">
            <Armchair className="size-3.5 shrink-0 text-[#6b7280]" />
            <span className="truncate">{seatLabel(booking)}</span>
          </p>
          {screenLabel ? (
            <p className="mt-0.5 pl-5 text-[11px] font-semibold tracking-wide text-[#9ca3af] uppercase">
              {screenLabel}
            </p>
          ) : null}

          {cancelled ? (
            <p className="mt-2 text-[11px] font-bold tracking-wide text-rose-600 uppercase">
              Cancelled
            </p>
          ) : null}

          {/* Price block — under details, full content width */}
          <div className="mt-4 max-w-md space-y-2 border-t border-[#ececec] pt-3 dark:border-border">
            <div className="flex items-center justify-between gap-6 text-[13px] text-[#6b7280]">
              <span>Ticket price</span>
              <span className="font-medium text-[#1a1a1a] dark:text-text">
                {money(ticketPrice)}
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between gap-6 text-[13px] text-[#6b7280]">
                <span>Convenience fees</span>
                <span className="font-medium text-[#1a1a1a] dark:text-text">{money(fees)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#9ca3af]">Incl. of Tax</p>
            </div>
          </div>

          <div className="mt-3 flex max-w-md items-end justify-between gap-6 border-t border-[#ececec] pt-3 dark:border-border">
            <span className="text-[14px] font-bold text-[#1a1a1a] dark:text-text">
              Amount Paid
            </span>
            <span className="text-[20px] font-extrabold tracking-tight text-[#1a1a1a] dark:text-text">
              {money(booking.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer meta strip */}
      <div className="grid grid-cols-1 gap-3 border-t border-[#ececec] bg-[#f5f5f5] px-4 py-3 dark:border-border dark:bg-surface-muted sm:grid-cols-3 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.06em] text-[#9ca3af] uppercase">
            Booking date & time
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#1a1a1a] dark:text-text">
            {formatBookedAt(booking.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.06em] text-[#9ca3af] uppercase">
            Payment method
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#1a1a1a] dark:text-text">
            {booking.paymentMethod || "UPI"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.06em] text-[#9ca3af] uppercase">
            Booking ID
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#1a1a1a] dark:text-text">
            {shortId(booking)}
          </p>
        </div>
      </div>
    </article>
  );
}
