"use client";

import Image from "next/image";
import Link from "next/link";
import type { VybeBooking } from "@/lib/bookings/storage";

const CATEGORY_LABEL: Record<VybeBooking["category"], string> = {
  movies: "Movies",
  events: "Events",
  play: "Game Zone",
  activities: "Activities",
};

function seatSummary(booking: VybeBooking) {
  if (booking.seats.length === 0) return booking.meta;
  return booking.seats.length > 3
    ? `${booking.seats.length} tickets`
    : booking.seats.join(", ");
}

/** Compact booking row — perforated stub with semicircle notches only (no timeline rail). */
export function BookingTicketStub({ booking }: { booking: VybeBooking }) {
  return (
    <Link
      href={`/tickets/${booking.id}`}
      className="group relative flex overflow-hidden rounded-[20px] border border-border bg-surface transition-colors hover:border-accent/35"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5 p-3.5 sm:gap-4 sm:p-4">
        <div className="relative h-[76px] w-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={booking.posterUrl}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent uppercase">
            {CATEGORY_LABEL[booking.category]}
          </span>
          <h2 className="mt-1 truncate text-[15px] font-extrabold text-text">{booking.title}</h2>
          <p className="truncate text-[12px] text-text-secondary">{booking.venue}</p>
          <p className="mt-0.5 truncate text-[12px] font-bold text-text">
            {booking.dateLabel} · {booking.timeLabel}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-text-muted">{seatSummary(booking)}</p>
        </div>
      </div>

      <div className="relative flex w-[118px] shrink-0 flex-col items-center justify-center gap-2 border-l border-dashed border-border px-2 py-3 sm:w-[128px]">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg lg:bg-dash"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 size-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-bg lg:bg-dash"
        />
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-current" />
          Confirmed
        </span>
        <span className="rounded-full bg-accent px-3 py-1.5 text-center text-[10px] font-extrabold tracking-wide text-white uppercase transition-transform group-hover:scale-105">
          View ticket
        </span>
      </div>
    </Link>
  );
}
