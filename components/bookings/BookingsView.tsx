"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Ticket } from "lucide-react";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { BookingTicketStub } from "@/components/bookings/BookingTicketStub";
import { useAccountData } from "@/components/account/useAccountData";
import { BOOKING_TABS, type BookingCategory } from "@/lib/bookings/storage";

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

  return (
    <div>
      <AccountPageHeader
        title="My bookings"
        subtitle="Movies, events, activities and game zone tickets in one place"
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

      <div className="space-y-3">
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
          filtered.map((booking) => <BookingTicketStub key={booking.id} booking={booking} />)
        )}
      </div>
    </div>
  );
}
