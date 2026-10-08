"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Minus, Plus, Zap } from "lucide-react";
import { useMemo, useState } from "react";
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
import { useClientNow } from "@/lib/hooks/useClientNow";
import {
  bookingModeFor,
  buildSlots,
  canStartAt,
  courtsFor,
  formatSlotRange,
  peakPrice,
  slotPeriod,
  type PlaySlot,
} from "@/lib/play/slots";
import type { PlayItem } from "@/types/play";

type BookPlaySlotsProps = {
  item: PlayItem;
  initialDate?: string;
};

const DURATIONS = [1, 2, 3] as const;
const MAX_PLAYERS = 8;

export function BookPlaySlots({ item, initialDate }: BookPlaySlotsProps) {
  const isEvent = item.kind === "event";
  const mode = bookingModeFor(item);
  const { unit, courts } = useMemo(() => courtsFor(item), [item]);

  const now = useClientNow();
  const dates = useMemo(() => (now ? getBookingDates(7) : []), [now]);
  const [pickedDate, setPickedDate] = useState("");
  const [courtId, setCourtId] = useState(courts[0]?.id ?? "");
  const [duration, setDuration] = useState(1);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [booking, setBooking] = useState<VybeBooking | null>(null);

  const dateIso =
    pickedDate ||
    (initialDate && dates.some((d) => d.iso === initialDate)
      ? initialDate
      : (dates[0]?.iso ?? ""));

  const slots = useMemo(
    () => (dateIso && !isEvent ? buildSlots(item, courtId, dateIso, now) : []),
    [item, courtId, dateIso, now, isEvent],
  );

  const effectiveDuration = mode === "session" ? 1 : duration;
  const startIndex =
    startHour == null ? -1 : slots.findIndex((slot) => slot.hour === startHour);
  const selectionValid =
    startIndex >= 0 && canStartAt(slots, startIndex, effectiveDuration);
  const chosen = selectionValid
    ? slots.slice(startIndex, startIndex + effectiveDuration)
    : [];

  const unitPrice = item.price ?? 699;
  const venueTotal =
    mode === "session"
      ? (chosen[0]?.price ?? 0) * qty
      : chosen.reduce((sum, slot) => sum + slot.price, 0);
  const total = isEvent ? unitPrice * qty : venueTotal;

  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(", ");
  const monthLabel = dates[0]?.month ?? "";
  const court = courts.find((entry) => entry.id === courtId) ?? courts[0];
  const periods = useMemo(() => groupByPeriod(slots), [slots]);

  function pickDate(iso: string) {
    setPickedDate(iso);
    setStartHour(null);
  }

  function pickCourt(id: string) {
    setCourtId(id);
    setStartHour(null);
  }

  function pickDuration(hours: number) {
    setDuration(hours);
    if (startIndex >= 0 && !canStartAt(slots, startIndex, hours)) setStartHour(null);
  }

  function confirm() {
    const date = dates.find((entry) => entry.iso === dateIso);
    const dateLabel = date ? `${date.weekday}, ${date.day} ${date.month}` : dateIso;

    const next: VybeBooking = isEvent
      ? {
          id: createBookingId(),
          bookingCode: createBookingCode(),
          category: "play",
          title: item.title,
          posterUrl: item.imageUrl,
          meta: `${item.sport ?? "Play"} · ${place}`,
          dateLabel,
          timeLabel: item.timeLabel || item.schedule,
          venue: place,
          seats: Array.from({ length: qty }, (_, i) => `Player ${i + 1}`),
          ticketPrice: unitPrice,
          total,
          createdAt: new Date().toISOString(),
        }
      : {
          id: createBookingId(),
          bookingCode: createBookingCode(),
          category: "play",
          title: item.title,
          posterUrl: item.imageUrl,
          meta:
            mode === "session"
              ? `${item.sport ?? "Play"} · ${qty} ${qty > 1 ? "people" : "person"}`
              : `${item.sport ?? "Play"} · ${effectiveDuration} hr${effectiveDuration > 1 ? "s" : ""}`,
          dateLabel,
          timeLabel: formatSlotRange(chosen[0].hour, effectiveDuration),
          venue: place,
          seats: [court?.name ?? unit],
          seatClass: court ? `${court.name} · ${court.detail}` : unit,
          ticketPrice: chosen[0]?.price ?? unitPrice,
          total,
          createdAt: new Date().toISOString(),
        };

    saveBooking(next);
    setBooking(next);
  }

  if (booking) {
    return <BookingConfirmed booking={booking} />;
  }

  const canConfirm = isEvent ? qty > 0 : selectionValid;
  const summaryLabel = isEvent
    ? `${qty} ticket${qty > 1 ? "s" : ""}`
    : selectionValid
      ? `${court?.name ?? unit} · ${formatSlotRange(chosen[0].hour, effectiveDuration)}`
      : "Pick a start time";

  return (
    <div className="w-full pb-24">
      <section className="border-b border-border bg-surface">
        <Container className="flex items-center gap-4 py-5 md:gap-5 md:py-6">
          <div className="relative aspect-[3/4] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-muted md:w-[88px]">
            <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="88px" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-extrabold text-text md:text-[28px]">
              {item.title}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-text-secondary md:text-[14px]">
              <MapPin className="size-3.5 shrink-0" />
              {place}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-text-muted">
              {item.sport}
              {!isEvent && item.hours ? (
                <>
                  <span aria-hidden>·</span>
                  <Clock3 className="size-3.5" />
                  {item.hours}
                </>
              ) : null}
            </p>
          </div>
        </Container>
      </section>

      <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <Container className="py-3">
          <div className="hide-scrollbar flex items-stretch gap-3 overflow-x-auto">
            <div className="flex w-10 shrink-0 rotate-180 items-center justify-center text-[12px] font-extrabold tracking-widest text-text-secondary [writing-mode:vertical-rl]">
              {monthLabel}
            </div>
            {dates.map((date) => {
              const active = date.iso === dateIso;
              return (
                <button
                  key={date.iso}
                  type="button"
                  onClick={() => pickDate(date.iso)}
                  className={`flex h-[64px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:border-accent/40"
                  }`}
                >
                  <span className="text-[18px] leading-none font-extrabold">{date.day}</span>
                  <span className="mt-1 text-[11px] font-semibold">
                    {date.isToday ? "Today" : date.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {isEvent ? (
        <Container className="pt-6">
          <div className="mb-5 rounded-xl bg-accent-soft px-4 py-3 text-[13px] font-semibold text-accent">
            Pick a date and tickets. Instant confirmation on VYBE.
          </div>
          <Counter
            title="Tickets"
            subtitle={`${formatInr(unitPrice)} ${item.priceUnit ?? "/ person"}`}
            value={qty}
            onChange={setQty}
            max={MAX_PLAYERS}
            label="tickets"
          />
        </Container>
      ) : (
        <Container className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
          <div className="space-y-8">
            {courts.length > 1 ? (
              <section>
                <StepTitle step={1} title={`Choose a ${unit.toLowerCase()}`} />
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {courts.map((entry) => {
                    const active = entry.id === courtId;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => pickCourt(entry.id)}
                        className={`rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                          active
                            ? "border-accent bg-accent-soft"
                            : "border-border bg-surface hover:border-accent/40"
                        }`}
                      >
                        <p className={`text-[15px] font-extrabold ${active ? "text-accent" : "text-text"}`}>
                          {entry.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-text-secondary">{entry.detail}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {mode === "court" ? (
              <section>
                <StepTitle step={courts.length > 1 ? 2 : 1} title="How long do you want to play?" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {DURATIONS.map((hours) => {
                    const active = hours === duration;
                    return (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => pickDuration(hours)}
                        className={`rounded-full border px-5 py-2.5 text-[13px] font-bold transition-colors ${
                          active
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-surface text-text hover:border-accent/40"
                        }`}
                      >
                        {hours} hr{hours > 1 ? "s" : ""}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section>
                <StepTitle step={1} title="How many people?" />
                <div className="mt-3">
                  <Counter
                    title="Swimmers"
                    subtitle={`${formatInr(unitPrice)} ${item.priceUnit ?? "/ session"} · 1 hr`}
                    value={qty}
                    onChange={setQty}
                    max={MAX_PLAYERS}
                    label="people"
                  />
                </div>
              </section>
            )}

            <section>
              <StepTitle
                step={mode === "court" ? (courts.length > 1 ? 3 : 2) : 2}
                title="Pick a start time"
              />
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Zap className="size-3.5 text-accent" />
                  Peak · {formatInr(peakPrice(item))}/hr
                </span>
                <span>Off-peak · {formatInr(unitPrice)}/hr</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-surface-muted ring-1 ring-border" />
                  Booked
                </span>
              </div>

              <div className="mt-4 space-y-5">
                {periods.map(({ period, slots: periodSlots }) => (
                  <div key={period}>
                    <p className="text-[12px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                      {period}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {periodSlots.map((slot) => {
                        const index = slots.indexOf(slot);
                        const unavailable = slot.booked || slot.past;
                        const fits = canStartAt(slots, index, effectiveDuration);
                        const inRange =
                          selectionValid &&
                          index >= startIndex &&
                          index < startIndex + effectiveDuration;
                        const isStart = inRange && index === startIndex;

                        return (
                          <button
                            key={slot.hour}
                            type="button"
                            disabled={!fits}
                            onClick={() => setStartHour(slot.hour)}
                            title={
                              slot.booked
                                ? "Already booked"
                                : slot.past
                                  ? "Time has passed"
                                  : !fits
                                    ? `Not free for ${effectiveDuration} hrs from here`
                                    : undefined
                            }
                            className={`relative rounded-xl border px-2 py-2.5 text-center transition-colors ${
                              isStart
                                ? "border-accent bg-accent text-white"
                                : inRange
                                  ? "border-accent bg-accent-soft text-accent"
                                  : unavailable
                                    ? "cursor-not-allowed border-border bg-surface-muted text-text-faint line-through"
                                    : fits
                                      ? "border-border bg-surface text-text hover:border-accent/50"
                                      : "cursor-not-allowed border-border bg-surface text-text-muted opacity-60"
                            }`}
                          >
                            <span className="block text-[13px] font-extrabold">{slot.label}</span>
                            <span
                              className={`mt-0.5 block text-[11px] font-semibold ${
                                isStart ? "text-white/85" : unavailable ? "" : "text-text-secondary"
                              }`}
                            >
                              {slot.booked ? "Booked" : formatInr(slot.price)}
                            </span>
                            {slot.peak && !unavailable ? (
                              <Zap
                                className={`absolute top-1.5 right-1.5 size-3 ${
                                  isStart ? "text-white" : "text-accent"
                                }`}
                              />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {slots.length > 0 && slots.every((slot) => slot.booked || slot.past) ? (
                  <p className="rounded-xl border border-border bg-surface px-4 py-3 text-[13px] text-text-secondary">
                    No slots left for this day. Try another date or {unit.toLowerCase()}.
                  </p>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-[calc(var(--vybe-header-h)+7rem)]">
            <h2 className="text-[16px] font-extrabold text-text">Booking summary</h2>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              <SummaryRow label={unit} value={court ? `${court.name} · ${court.detail}` : "—"} />
              <SummaryRow
                label="Date"
                value={(() => {
                  const date = dates.find((entry) => entry.iso === dateIso);
                  return date ? `${date.weekday}, ${date.day} ${date.month}` : "—";
                })()}
              />
              <SummaryRow
                label="Time"
                value={selectionValid ? formatSlotRange(chosen[0].hour, effectiveDuration) : "—"}
              />
              {mode === "session" ? (
                <SummaryRow label="People" value={String(qty)} />
              ) : (
                <SummaryRow label="Duration" value={`${effectiveDuration} hr${effectiveDuration > 1 ? "s" : ""}`} />
              )}
            </dl>
            {chosen.length > 0 ? (
              <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-[12px] text-text-secondary">
                {mode === "session" ? (
                  <div className="flex justify-between">
                    <span>
                      {formatInr(chosen[0].price)} × {qty}
                    </span>
                    <span>{formatInr(chosen[0].price * qty)}</span>
                  </div>
                ) : (
                  chosen.map((slot) => (
                    <div key={slot.hour} className="flex justify-between">
                      <span className="inline-flex items-center gap-1">
                        {formatSlotRange(slot.hour, 1)}
                        {slot.peak ? <Zap className="size-3 text-accent" /> : null}
                      </span>
                      <span>{formatInr(slot.price)}</span>
                    </div>
                  ))
                )}
              </div>
            ) : null}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-[14px] font-bold text-text">Total</span>
              <span className="text-[20px] font-extrabold text-text">{formatInr(total)}</span>
            </div>
            <p className="mt-2 text-[11px] text-text-muted">
              Free cancellation up to 6 hours before your slot.
            </p>
          </aside>
        </Container>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <div className="min-w-0">
            <p className="truncate text-[12px] text-text-secondary">{summaryLabel}</p>
            <p className="text-[18px] font-extrabold text-text">{formatInr(total)}</p>
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
              disabled={!canConfirm}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEvent ? "Confirm booking" : "Book slot"}
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
}

function groupByPeriod(slots: PlaySlot[]) {
  const groups: { period: string; slots: PlaySlot[] }[] = [];
  for (const slot of slots) {
    const period = slotPeriod(slot.hour);
    const last = groups[groups.length - 1];
    if (last && last.period === period) last.slots.push(slot);
    else groups.push({ period, slots: [slot] });
  }
  return groups;
}

function StepTitle({ step, title }: { step: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-[17px] font-extrabold text-text md:text-[19px]">
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-[12px] font-extrabold text-white">
        {step}
      </span>
      {title}
    </h2>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="text-right font-semibold text-text">{value}</dd>
    </div>
  );
}

function Counter({
  title,
  subtitle,
  value,
  onChange,
  max,
  label,
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (next: number) => void;
  max: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
      <div>
        <p className="text-[15px] font-extrabold text-text">{title}</p>
        <p className="text-[13px] text-text-secondary">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= 1}
          onClick={() => onChange(Math.max(1, value - 1))}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-[16px] font-extrabold text-text">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
