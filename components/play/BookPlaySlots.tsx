"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { Container } from "@/components/common/Container";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { getBookingDates } from "@/lib/data/booking";
import { formatInr } from "@/lib/format";
import type { PlayItem } from "@/types/play";

type BookPlaySlotsProps = {
  item: PlayItem;
};

export function BookPlaySlots({ item }: BookPlaySlotsProps) {
  const isEvent = item.kind === "event";
  const [dates, setDates] = useState<ReturnType<typeof getBookingDates>>([]);
  const [dateIso, setDateIso] = useState("");
  const [slot, setSlot] = useState(item.slots?.[0] ?? "6:00 PM");
  const [hours, setHours] = useState(1);
  const [qty, setQty] = useState(1);
  const [booking, setBooking] = useState<VybeBooking | null>(null);

  useEffect(() => {
    const next = getBookingDates(5);
    setDates(next);
    setDateIso((current) => current || next[0]?.iso || "");
  }, []);

  const unit = item.price ?? 699;
  const total = isEvent ? unit * qty : unit * hours;
  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(", ");
  const monthLabel = dates[0]?.month ?? "";

  function confirm() {
    const date = dates.find((entry) => entry.iso === dateIso);
    const dateLabel = date
      ? `${date.weekday}, ${date.day} ${date.month}`
      : dateIso;
    const seats = isEvent
      ? Array.from({ length: qty }, (_, i) => `Player ${i + 1}`)
      : [`${hours} hr slot`];
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "play",
      title: item.title,
      posterUrl: item.imageUrl,
      meta: `${item.sport ?? "Play"} · ${place}`,
      dateLabel,
      timeLabel: isEvent ? item.timeLabel || item.schedule : slot,
      venue: place,
      seats,
      ticketPrice: unit,
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
    <div className="w-full pb-20">
      <section className="border-b border-border bg-surface">
        <Container className="flex items-center gap-4 py-5 md:gap-5 md:py-6">
          <div className="relative aspect-[3/4] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-muted md:w-[88px]">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-extrabold text-text md:text-[28px]">
              {item.title}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-text-secondary md:text-[14px]">
              <MapPin className="size-3.5 shrink-0" />
              {place}
            </p>
            <p className="mt-1 text-[13px] text-text-muted">{item.sport}</p>
          </div>
        </Container>
      </section>

      <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-stretch gap-3 overflow-x-auto hide-scrollbar">
            <div className="flex w-10 shrink-0 items-center justify-center text-[12px] font-extrabold tracking-widest text-text-secondary [writing-mode:vertical-rl] rotate-180">
              {monthLabel}
            </div>
            {dates.map((date) => {
              const active = date.iso === dateIso;
              return (
                <button
                  key={date.iso}
                  type="button"
                  onClick={() => setDateIso(date.iso)}
                  className={`flex h-[64px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:border-accent/40"
                  }`}
                >
                  <span className="text-[18px] font-extrabold leading-none">
                    {date.day}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold">
                    {date.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="pt-6">
        <div className="mb-5 rounded-xl bg-accent-soft px-4 py-3 text-[13px] font-semibold text-accent">
          {isEvent
            ? "Pick a date and tickets. Instant confirmation on VYBE."
            : "Pick a date and slot. Instant confirmation on VYBE."}
        </div>

        {isEvent ? (
          <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
            <div>
              <p className="text-[15px] font-extrabold text-text">Tickets</p>
              <p className="text-[13px] text-text-secondary">
                {formatInr(unit)} {item.priceUnit ?? "/ person"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease tickets"
                disabled={qty <= 1}
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-[16px] font-extrabold text-text">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase tickets"
                disabled={qty >= 8}
                onClick={() => setQty((n) => Math.min(8, n + 1))}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-[18px] font-extrabold text-text md:text-[20px]">
              Select a slot
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(item.slots ?? []).map((time) => {
                const active = time === slot;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSlot(time)}
                    className={`rounded-xl border px-4 py-2.5 text-[13px] font-bold ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-surface text-text hover:border-accent/40"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
              <div>
                <p className="text-[15px] font-extrabold text-text">Duration</p>
                <p className="text-[13px] text-text-secondary">
                  {formatInr(unit)} / hour
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease hours"
                  disabled={hours <= 1}
                  onClick={() => setHours((n) => Math.max(1, n - 1))}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-[16px] font-extrabold text-text">
                  {hours}h
                </span>
                <button
                  type="button"
                  aria-label="Increase hours"
                  disabled={hours >= 4}
                  onClick={() => setHours((n) => Math.min(4, n + 1))}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <div>
            <p className="text-[12px] text-text-secondary">
              {isEvent ? `${qty} ticket${qty > 1 ? "s" : ""}` : `${hours} hour slot`}
            </p>
            <p className="text-[18px] font-extrabold text-text">
              {formatInr(total)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/play/${item.id}`}
              className="hidden rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text sm:inline-flex"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={confirm}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Confirm booking
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
}
