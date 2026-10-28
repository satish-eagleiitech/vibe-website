"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, MapPin, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { getBookingDates } from "@/lib/data/booking";
import { formatInr } from "@/lib/format";
import { useClientNow } from "@/lib/hooks/useClientNow";
import { readProfile } from "@/lib/profile/storage";
import {
  bookingModeFor,
  buildSlots,
  canStartAt,
  courtsFor,
  type PlayCourt,
  type PlaySlot,
} from "@/lib/play/slots";
import type { PlayItem } from "@/types/play";

type BookPlaySlotsProps = {
  item: PlayItem;
  initialDate?: string;
};

const MAX_HOURS = 3;

function compactRange(start: number, duration: number) {
  const end = start + duration;
  const part = (hour: number) => {
    const h24 = hour % 24;
    const suffix = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;
    return { h12, suffix };
  };
  const from = part(start);
  const to = part(end);
  if (from.suffix === to.suffix) return `${from.h12} - ${to.h12} ${from.suffix}`;
  return `${from.h12} ${from.suffix} - ${to.h12} ${to.suffix}`;
}

function clock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins} : ${String(rest).padStart(2, "0")}`;
}

function notesFor(item: PlayItem) {
  const sport = (item.sport ?? "").toLowerCase();
  if (/turf|football|box|cricket/.test(sport)) {
    return ["Astro-turf shoes are recommended", "Arrive 5 mins early to avoid losing playtime"];
  }
  return ["Arrive 10 mins early to check in", "Carry a valid ID for entry"];
}

export function BookPlaySlots({ item, initialDate }: BookPlaySlotsProps) {
  const isEvent = item.kind === "event";
  const mode = bookingModeFor(item);
  const { unit, courts } = useMemo(() => courtsFor(item), [item]);
  const now = useClientNow();
  const dates = useMemo(() => (now ? getBookingDates(14) : []), [now]);

  const [pickedDate, setPickedDate] = useState("");
  const [courtId, setCourtId] = useState(courts[0]?.id ?? "");
  const [duration, setDuration] = useState(1);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [period, setPeriod] = useState<"Morning" | "Evening">("Morning");
  const [qty, setQty] = useState(1);
  const [stage, setStage] = useState<"pick" | "review">("pick");
  const [policyOpen, setPolicyOpen] = useState(false);
  const [left, setLeft] = useState(5 * 60);
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const { gate, modal } = useLoginGate();

  const dateIso =
    pickedDate ||
    (initialDate && dates.some((date) => date.iso === initialDate) ? initialDate : (dates[0]?.iso ?? ""));

  const boards = useMemo(() => {
    if (!dateIso || isEvent) return [] as { court: PlayCourt; slots: PlaySlot[] }[];
    return courts.map((court) => ({
      court,
      slots: buildSlots(item, court.id, dateIso, now),
    }));
  }, [courts, dateIso, isEvent, item, now]);

  const hours = boards[0]?.slots ?? [];
  const visible = hours.filter((slot) => (period === "Morning" ? slot.hour % 24 < 12 : slot.hour % 24 >= 12));

  function freeBoards(hour: number) {
    return boards.filter(({ slots }) => {
      const index = slots.findIndex((slot) => slot.hour === hour);
      return canStartAt(slots, index, mode === "session" ? 1 : duration);
    });
  }

  const openBoards = startHour == null ? [] : freeBoards(startHour);
  const court = openBoards.find((entry) => entry.court.id === courtId)?.court ?? openBoards[0]?.court;
  const chosenSlots = useMemo(() => {
    if (startHour == null || !court) return [] as PlaySlot[];
    const board = boards.find((entry) => entry.court.id === court.id);
    if (!board) return [];
    const index = board.slots.findIndex((slot) => slot.hour === startHour);
    const length = mode === "session" ? 1 : duration;
    if (!canStartAt(board.slots, index, length)) return [];
    return board.slots.slice(index, index + length);
  }, [boards, court, duration, mode, startHour]);

  const unitPrice = item.price ?? 699;
  const slotTotal =
    mode === "session"
      ? (chosenSlots[0]?.price ?? 0) * qty
      : chosenSlots.reduce((sum, slot) => sum + slot.price, 0);
  const orderAmount = isEvent ? unitPrice * qty : slotTotal;
  const fee = orderAmount > 0 ? Math.max(8, Math.round(orderAmount * 0.012)) : 0;
  const payable = orderAmount + fee;
  const canProceed = isEvent ? qty > 0 : chosenSlots.length > 0;
  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(", ");
  const heading = item.sport || item.title;
  const date = dates.find((entry) => entry.iso === dateIso);
  const range = chosenSlots[0] ? compactRange(chosenSlots[0].hour, chosenSlots.length) : "";
  const profile = stage === "review" ? readProfile() : null;

  useEffect(() => {
    if (stage !== "review") return;
    const timer = window.setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  function pickDate(iso: string) {
    setPickedDate(iso);
    setStartHour(null);
  }

  function pickHour(hour: number) {
    setStartHour(hour);
    const next = freeBoards(hour)[0];
    if (next) setCourtId(next.court.id);
  }

  function goReview() {
    if (!canProceed) return;
    gate(() => {
      setLeft(5 * 60);
      setStage("review");
    });
  }

  function confirm() {
    const dateLabel = date ? `${date.weekday}, ${date.day} ${date.month}` : dateIso;
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "play",
      title: item.title,
      posterUrl: item.imageUrl,
      meta: isEvent
        ? `${heading} · ${qty} ticket${qty > 1 ? "s" : ""}`
        : `${heading} · ${court?.name ?? unit}`,
      dateLabel,
      timeLabel: isEvent ? item.timeLabel || item.schedule : range,
      venue: place,
      seats: isEvent ? Array.from({ length: qty }, (_, index) => `Player ${index + 1}`) : [court?.name ?? unit],
      seatClass: court ? court.detail.replaceAll(" · ", " | ") : unit,
      ticketPrice: chosenSlots[0]?.price ?? unitPrice,
      convenienceFee: fee,
      paymentMethod: "UPI",
      total: payable,
      createdAt: new Date().toISOString(),
    };
    saveBooking(next);
    setBooking(next);
  }

  if (booking) return <BookingConfirmed booking={booking} />;

  if (stage === "review" && profile) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-center text-[22px] font-extrabold text-text md:text-[26px]">Review your booking</h1>
        <div className="mt-4 rounded-xl bg-accent-soft px-4 py-2.5 text-center text-[13px] font-semibold text-accent">
          Complete your booking in {clock(left)} min
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <p className="text-[15px] font-extrabold text-text">{item.title}</p>
                  <p className="text-[13px] text-text-secondary">{item.venue}</p>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4 text-[14px]">
                <div>
                  <p className="font-extrabold text-text">
                    {date
                      ? `${date.weekday}, ${date.day} ${date.month.charAt(0)}${date.month.slice(1).toLowerCase()}`
                      : dateIso}
                    {range ? ` | ${range}` : ""}
                  </p>
                  <p className="mt-1 font-semibold text-text">{court?.name ?? `${qty} ticket${qty > 1 ? "s" : ""}`}</p>
                  {court ? (
                    <p className="text-[13px] text-text-secondary">{court.detail.replaceAll(" · ", " | ")}</p>
                  ) : null}
                </div>
                <p className="font-extrabold text-text">{formatInr(orderAmount)}</p>
              </div>
            </div>
            <h2 className="mt-8 text-[18px] font-extrabold text-text">Things to know</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] text-text-secondary">
              {notesFor(item).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <aside className="h-fit space-y-6">
            <div>
              <h2 className="text-[18px] font-extrabold text-text">Payment Summary</h2>
              <dl className="mt-3 space-y-2 text-[14px]">
                <Row label="Order Amount" value={formatInr(orderAmount)} />
                <Row label="Platform Fee (Incl. Taxes)" value={formatInr(fee)} />
                <Row label="Subtotal" value={formatInr(payable)} strong />
              </dl>
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-text">Your Details</h2>
              <div className="mt-3 flex items-start gap-2 text-[14px]">
                <MapPin className="mt-0.5 size-4 text-text-secondary" />
                <div>
                  <p className="font-extrabold text-text">{profile.name}</p>
                  <p className="text-text-secondary">{profile.phone}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPolicyOpen((open) => !open)}
              className="flex w-full items-center justify-between border-t border-border pt-4 text-left"
            >
              <span className="text-[15px] font-extrabold text-text">Cancellation policy</span>
              <ChevronDown className={`size-4 transition-transform ${policyOpen ? "rotate-180" : ""}`} />
            </button>
            {policyOpen ? (
              <p className="text-[13px] text-text-secondary">Free cancellation up to 6 hours before your slot.</p>
            ) : null}
            <button
              type="button"
              onClick={confirm}
              className="flex h-14 w-full items-center justify-between rounded-2xl bg-text px-5 text-bg"
            >
              <span>
                <span className="block text-[16px] font-extrabold">{formatInr(payable)}</span>
                <span className="text-[11px] font-bold tracking-wide">TOTAL</span>
              </span>
              <span className="text-[16px] font-extrabold">Pay Now</span>
            </button>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      {modal}
      <header className="text-center">
        <h1 className="text-[26px] font-extrabold tracking-tight text-text md:text-[32px]">{heading}</h1>
        <p className="mt-1 text-[14px] text-text-secondary">{item.venue}</p>
      </header>

      <div className="mt-6 flex items-end gap-2">
        <div className="mb-2 hidden w-8 shrink-0 rotate-180 text-[11px] font-extrabold tracking-widest text-text-muted [writing-mode:vertical-rl] sm:block">
          {dates[0]?.month ?? ""}
        </div>
        <div className="hide-scrollbar flex gap-1 overflow-x-auto">
          {dates.map((entry) => {
            const active = entry.iso === dateIso;
            return (
              <button
                key={entry.iso}
                type="button"
                onClick={() => pickDate(entry.iso)}
                className={`flex w-12 shrink-0 flex-col items-center rounded-xl py-2 text-center ${
                  active ? "bg-text text-bg" : "text-text"
                }`}
              >
                <span className="text-[11px] font-semibold">{entry.isToday ? "Today" : entry.weekday}</span>
                <span className="text-[16px] font-extrabold">{entry.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isEvent ? (
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
          <div>
            <p className="text-[15px] font-extrabold text-text">Tickets</p>
            <p className="text-[13px] text-text-secondary">
              {formatInr(unitPrice)} {item.priceUnit ?? "/ person"}
            </p>
          </div>
          <Stepper value={qty} min={1} max={8} onChange={setQty} label="tickets" />
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[16px] font-extrabold text-text">Duration</p>
              <p className="text-[12px] text-text-muted">Duration of the slots</p>
            </div>
            {mode === "court" ? (
              <div className="inline-flex items-center gap-3 rounded-full border border-text px-3 py-1.5">
                <button
                  type="button"
                  aria-label="Shorter slot"
                  disabled={duration <= 1}
                  onClick={() => {
                    setDuration((value) => Math.max(1, value - 1));
                    setStartHour(null);
                  }}
                  className="text-text disabled:opacity-30"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-10 text-center text-[14px] font-extrabold text-text">{duration} hr</span>
                <button
                  type="button"
                  aria-label="Longer slot"
                  disabled={duration >= MAX_HOURS}
                  onClick={() => {
                    setDuration((value) => Math.min(MAX_HOURS, value + 1));
                    setStartHour(null);
                  }}
                  className="text-text disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            ) : (
              <Stepper value={qty} min={1} max={8} onChange={setQty} label="people" />
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-full bg-surface-muted p-1">
            {(["Morning", "Evening"] as const).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setPeriod(name)}
                className={`h-11 rounded-full text-[14px] font-extrabold ${
                  period === name ? "bg-surface text-text shadow-sm" : "text-text-secondary"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-[16px] font-extrabold text-text">Time slots available</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visible.map((slot) => {
              const free = freeBoards(slot.hour);
              const active = slot.hour === startHour;
              return (
                <button
                  key={slot.hour}
                  type="button"
                  disabled={free.length === 0}
                  onClick={() => pickHour(slot.hour)}
                  className={`rounded-2xl border px-4 py-4 text-center ${
                    active
                      ? "border-text bg-surface"
                      : free.length
                        ? "border-border bg-surface hover:border-text/40"
                        : "cursor-not-allowed border-border bg-surface-muted text-text-muted"
                  }`}
                >
                  <span className="block text-[16px] font-extrabold">{compactRange(slot.hour, mode === "session" ? 1 : duration)}</span>
                  <span className="mt-1 block text-[13px] text-text-secondary">
                    {free.length === 0 ? (slot.past ? "Passed" : "Booked") : `${free.length} ${unit.toLowerCase()}${free.length > 1 ? "s" : ""}`}
                  </span>
                </button>
              );
            })}
          </div>

          {openBoards.length > 0 ? (
            <div className="mt-8">
              <p className="text-[15px] font-extrabold text-text">
                {`${openBoards.length} ${unit.toLowerCase()}${openBoards.length > 1 ? "s" : ""} available`}
              </p>
              <div className="mt-3 space-y-3">
                {openBoards.map(({ court: entry, slots }) => {
                  const index = slots.findIndex((slot) => slot.hour === startHour);
                  const price =
                    mode === "session"
                      ? (slots[index]?.price ?? 0) * qty
                      : slots.slice(index, index + duration).reduce((sum, slot) => sum + slot.price, 0);
                  const selected = entry.id === court?.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setCourtId(entry.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-3 text-left"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                        <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-extrabold text-text">{entry.name}</p>
                        <p className="text-[13px] text-text-secondary">{entry.detail.replaceAll(" · ", " | ")}</p>
                        <p className="text-[13px] font-semibold text-text">{formatInr(price)}</p>
                      </div>
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-md border ${
                          selected ? "border-text bg-text text-bg" : "border-border"
                        }`}
                      >
                        {selected ? <Check className="size-4" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          {canProceed && !isEvent ? (
            <>
              <p className="text-[14px] font-extrabold text-text">
                1 {unit.toLowerCase()} reserved
              </p>
              <p className="text-[13px] text-text-secondary">{range}</p>
            </>
          ) : (
            <Link href={`/play/${item.id}`} className="text-[13px] font-semibold text-text-secondary">
              Back to venue
            </Link>
          )}
        </div>
        <button
          type="button"
          disabled={!canProceed}
          onClick={goReview}
          className="rounded-full bg-text px-8 py-3 text-[15px] font-extrabold text-bg disabled:opacity-40"
        >
          Proceed
        </button>
      </div>

    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "border-t border-border pt-2 font-extrabold text-text" : ""}`}>
      <dt className={strong ? "" : "text-text-secondary"}>{label}</dt>
      <dd className="font-semibold text-text">{value}</dd>
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-5 text-center text-[15px] font-extrabold">{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
