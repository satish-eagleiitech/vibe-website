"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, MapPin, QrCode, Search, Ticket } from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { useAccountData } from "@/components/account/useAccountData";
import { BOOKING_TABS, type BookingCategory, type VybeBooking } from "@/lib/bookings/storage";

const CATEGORY_LABEL: Record<BookingCategory, string> = {
  movies: "Movies",
  dining: "Dining",
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

function TicketRow({ booking }: { booking: VybeBooking }) {
  return (
    <Link
      href={`/tickets/${booking.id}`}
      className="group relative flex flex-col rounded-[20px] border border-border bg-surface transition-colors hover:border-accent/35 @md:flex-row @md:items-stretch"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5 p-3.5 @xl:gap-4 @xl:p-4">
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
          <p className="mt-0.5 truncate text-[12px] font-bold text-accent @xl:hidden">
            {booking.dateLabel} · {booking.timeLabel}
          </p>
        </div>
        <div className="hidden w-[130px] shrink-0 text-center @xl:block">
          <p className="truncate text-[11px] font-bold tracking-wide text-text-muted uppercase">
            {booking.dateLabel}
          </p>
          <p className="mt-0.5 text-[14px] font-extrabold text-accent">{booking.timeLabel}</p>
          <p className="mt-0.5 truncate text-[11px] font-semibold tracking-wide text-text-secondary uppercase">
            {seatSummary(booking)}
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-2 border-t-2 border-dashed border-border px-3.5 py-2.5 @md:w-[128px] @md:shrink-0 @md:flex-col @md:justify-center @md:border-t-0 @md:border-l-2 @md:px-2 @md:py-0">
        <span
          aria-hidden
          className="absolute top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg lg:bg-dash"
        />
        <span
          aria-hidden
          className="absolute top-0 right-0 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-bg @md:top-auto @md:right-auto @md:bottom-0 @md:left-0 @md:-translate-x-1/2 @md:translate-y-1/2 lg:bg-dash"
        />
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-current" />
          Confirmed
        </span>
        <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-extrabold tracking-wide whitespace-nowrap text-white uppercase transition-transform group-hover:scale-105">
          View ticket
        </span>
      </div>
    </Link>
  );
}

export function BookingsView() {
  const params = useSearchParams();
  const initialTab = (params.get("tab") as BookingCategory | "all") || "all";
  const [tab, setTab] = useState<BookingCategory | "all">(
    BOOKING_TABS.some((item) => item.id === initialTab) ? initialTab : "all",
  );
  const [query, setQuery] = useState("");
  const data = useAccountData();
  const bookings = useMemo(() => data?.bookings ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter(
      (item) =>
        (tab === "all" || item.category === tab) &&
        (!q ||
          item.title.toLowerCase().includes(q) ||
          item.venue.toLowerCase().includes(q)),
    );
  }, [bookings, tab, query]);

  const next = filtered[0] ?? bookings[0] ?? null;
  const counts = (Object.keys(CATEGORY_LABEL) as BookingCategory[]).map((category) => ({
    category,
    count: bookings.filter((item) => item.category === category).length,
  }));
  const maxCount = Math.max(1, ...counts.map((row) => row.count));

  return (
    <div>
      <AccountPageHeader
        title="My bookings"
        subtitle="Movies, dining, events and game zone tickets in one place"
      />

      <div className="flex flex-col gap-3 rounded-[24px] border border-border bg-surface p-3 sm:p-4 xl:flex-row xl:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or venue"
            className="h-11 w-full rounded-full bg-surface-muted pr-4 pl-10 text-[13px] font-semibold text-text placeholder:text-text-muted"
          />
        </label>
        <div className="hide-scrollbar flex gap-1 overflow-x-auto rounded-full bg-surface-muted p-1">
          {BOOKING_TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-bold tracking-wide uppercase transition-colors ${
                  active
                    ? "bg-sidebar text-white dark:bg-accent"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 mb-3 text-[14px] font-extrabold tracking-wide text-text uppercase">
        Result ({filtered.length})
      </p>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="@container order-2 space-y-3 xl:order-1">
          {!data ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="h-[108px] animate-pulse rounded-[20px] bg-surface" />
            ))
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] border border-border bg-surface px-6 py-12 text-center">
              <Ticket className="mx-auto size-10 text-text-muted" />
              <p className="mt-3 text-[16px] font-extrabold text-text">No bookings found</p>
              <p className="mt-1 text-[14px] text-text-secondary">
                {query ? "Try a different search." : "Book a movie or event to see your ticket here."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Link
                  href="/movies"
                  className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse movies
                </Link>
                <Link
                  href="/events"
                  className="inline-flex rounded-full bg-surface-muted px-5 py-2.5 text-sm font-bold text-text"
                >
                  Browse events
                </Link>
              </div>
            </div>
          ) : (
            filtered.map((booking) => <TicketRow key={booking.id} booking={booking} />)
          )}
        </div>

        {next ? (
          <aside className="order-1 xl:order-2">
            <div className="rounded-[24px] bg-sidebar p-5 text-white xl:sticky xl:top-[calc(var(--vybe-header-h)+2.5rem)]">
              <p className="text-[10px] font-extrabold tracking-[0.16em] text-accent uppercase">
                Next up
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-wide text-white/50 uppercase">Date</p>
                  <p className="truncate text-[15px] font-extrabold">{next.dateLabel}</p>
                </div>
                <div className="flex flex-1 items-center gap-1 text-accent">
                  <span className="h-px flex-1 border-t border-dashed border-white/25" />
                  <Ticket className="size-4" />
                  <span className="h-px flex-1 border-t border-dashed border-white/25" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold tracking-wide text-white/50 uppercase">Time</p>
                  <p className="text-[15px] font-extrabold">{next.timeLabel}</p>
                </div>
              </div>

              <div className="relative mt-4 h-36 overflow-hidden rounded-2xl sm:h-44 xl:h-36">
                <Image
                  src={next.posterUrl}
                  alt={next.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <p className="absolute inset-x-3 bottom-3 line-clamp-2 text-[16px] leading-tight font-extrabold">
                  {next.title}
                </p>
              </div>

              <ul className="mt-4 space-y-2 text-[12px] text-white/70">
                <li className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{next.venue}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{seatSummary(next)}</span>
                </li>
                <li className="flex items-center gap-2">
                  <QrCode className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate font-mono tracking-wider">{next.id}</span>
                </li>
              </ul>

              <Link
                href={`/tickets/${next.id}`}
                className="mt-4 flex h-11 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
              >
                Open ticket
              </Link>

              <div className="mt-5 hidden border-t border-white/10 pt-4 xl:block">
                <p className="text-[10px] font-extrabold tracking-[0.16em] text-white/50 uppercase">
                  By category
                </p>
                <ul className="mt-3 space-y-2.5">
                  {counts.map((row) => (
                    <li key={row.category} className="text-[12px]">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white/75">{CATEGORY_LABEL[row.category]}</span>
                        <span>{row.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${(row.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
