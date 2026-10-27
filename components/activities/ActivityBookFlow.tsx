"use client";

import Image from "next/image";
import { CalendarDays, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PhoneLoginDialog } from "@/components/auth/PhoneLoginDialog";
import { isSignedIn } from "@/lib/auth/session";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { formatInr } from "@/lib/format";
import { DEFAULT_PROFILE, readProfile, type VybeProfile } from "@/lib/profile/storage";
import type { Activity } from "@/types/activity";

type Stage = "pick" | "tickets" | "review";

type TicketOption = {
  id: string;
  name: string;
  price: number;
  note: string;
};

type ActivityBookFlowProps = {
  activity: Activity;
  onClose: () => void;
  onConfirmed: (booking: VybeBooking) => void;
};

function isKart(activity: Activity) {
  return /kart/i.test(`${activity.id} ${activity.title} ${activity.category}`);
}

function showTime(activity: Activity) {
  const match = activity.schedule?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  return match ? `${match[1]} daily` : "12:30 PM daily";
}

function ticketsFor(activity: Activity): TicketOption[] {
  if (isKart(activity)) {
    return [
      {
        id: "solo",
        name: "Solo Karting Experience · 8 Laps",
        price: activity.price,
        note: "This ticket grants access to one individual on a single kart. In-house wait time may apply.",
      },
      {
        id: "duo",
        name: "Duo Karting Experience · 8 Laps",
        price: Math.round(activity.price * 1.35),
        note: "This ticket grants entry to two individuals sharing a single kart.",
      },
    ];
  }
  return [
    {
      id: "pass",
      name: `${activity.title} | 1 Game`,
      price: activity.price,
      note: "This ticket grants entry to 1 individual.",
    },
    {
      id: "combo",
      name: `${activity.title} + Add-on`,
      price: Math.round(activity.price * 1.6),
      note: "This ticket grants entry to one individual with an add-on.",
    },
  ];
}

function clock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  return `${String(mins).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function localIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function longDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dayChips() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: localIso(date),
      label: date.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }),
    };
  });
}

export function ActivityBookFlow({ activity, onClose, onConfirmed }: ActivityBookFlowProps) {
  const kart = isKart(activity);
  const options = useMemo(() => ticketsFor(activity), [activity]);
  const chips = useMemo(() => dayChips(), []);
  const [stage, setStage] = useState<Stage>("pick");
  const [dateIso, setDateIso] = useState("");
  const [slot, setSlot] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({ [options[0].id]: 1 });
  const [loginOpen, setLoginOpen] = useState(false);
  const [left, setLeft] = useState(9 * 60);
  const [profile, setProfile] = useState<VybeProfile>(DEFAULT_PROFILE);
  const venue = activity.venue ?? activity.category;
  const slots = kart
    ? ["11:00 AM – 4:00 PM", "4:00 PM – 11:00 PM"]
    : [showTime(activity).replace(" daily", "")];
  const chosenSlot = slot || (kart ? "" : slots[0]);
  const dateLabel = dateIso ? longDate(dateIso) : "";
  const lines = options
    .map((option) => ({ ...option, count: qty[option.id] ?? 0 }))
    .filter((option) => option.count > 0);
  const ticketCount = lines.reduce((sum, line) => sum + line.count, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.count, 0);
  const fees = subtotal > 0 ? Math.max(9, Math.round(subtotal * 0.016)) : 0;
  const total = subtotal + fees;
  const canProceed = Boolean(dateIso) && (!kart || Boolean(slot));

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  useEffect(() => {
    if (stage !== "review" && stage !== "tickets") return;
    const timer = window.setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  function setCount(id: string, next: number) {
    setQty((current) => ({ ...current, [id]: Math.max(0, Math.min(8, next)) }));
  }

  function goReview() {
    if (ticketCount < 1) return;
    if (!isSignedIn()) {
      setLoginOpen(true);
      return;
    }
    setStage("review");
  }

  function pay() {
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "activities",
      title: activity.title,
      posterUrl: activity.imageUrl,
      meta: lines.map((line) => `${line.count} × ${line.name}`).join(", "),
      dateLabel,
      timeLabel: chosenSlot,
      venue: `${venue}, Hyderabad`,
      seats: lines.map((line) => `${line.count} × ${line.name}`),
      seatClass: lines[0]?.name,
      theatreName: venue,
      ticketPrice: lines[0]?.price ?? activity.price,
      convenienceFee: fees,
      paymentMethod: "UPI",
      total,
      createdAt: new Date().toISOString(),
    };
    saveBooking(next);
    onConfirmed(next);
  }

  return (
    <>
      {stage === "pick" ? (
        <VisitDialog
          activity={activity}
          kart={kart}
          chips={chips}
          dateIso={dateIso}
          slot={slot}
          slots={slots}
          canProceed={canProceed}
          onDate={setDateIso}
          onSlot={setSlot}
          onClose={() => {
            if (dateIso && chosenSlot) setStage("tickets");
            else onClose();
          }}
          onProceed={() => {
            if (!slot && !kart) setSlot(slots[0]);
            setStage("tickets");
          }}
        />
      ) : null}

      {stage === "tickets" || stage === "review" ? (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-bg">
          <h1 className="px-4 pt-5 text-center text-[18px] font-extrabold text-text md:text-[20px]">
            {activity.title}
            {venue ? ` | ${venue}` : ""}
          </h1>
          <div className="mt-3 bg-[#e7f8ef] px-4 py-2.5 text-center text-[13px] font-semibold text-[#1c7a45]">
            Complete your booking in {clock(left)} mins
          </div>

          {stage === "tickets" ? (
            <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-28">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 size-5 text-text-secondary" />
                  <div>
                    <p className="text-[15px] font-extrabold text-text">{dateLabel}</p>
                    <p className="text-[13px] text-text-secondary">{chosenSlot}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStage("pick")}
                  className="rounded-full border border-border px-4 py-2 text-[13px] font-extrabold text-text"
                >
                  Change
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {options.map((option) => {
                  const count = qty[option.id] ?? 0;
                  return (
                    <div key={option.id} className="border-b border-border pb-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[16px] font-extrabold text-text">{option.name}</p>
                          <p className="mt-1 text-[15px] font-extrabold text-text">{formatInr(option.price)}</p>
                        </div>
                        {count > 0 ? (
                          <div className="inline-flex items-center gap-3 rounded-full bg-text px-3 py-1.5 text-bg">
                            <button type="button" aria-label="Decrease" onClick={() => setCount(option.id, count - 1)}>
                              <Minus className="size-4" />
                            </button>
                            <span className="min-w-4 text-center text-[14px] font-extrabold">{count}</span>
                            <button type="button" aria-label="Increase" onClick={() => setCount(option.id, count + 1)}>
                              <Plus className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCount(option.id, 1)}
                            className="rounded-full border border-text px-5 py-2 text-[14px] font-extrabold text-text"
                          >
                            Add
                          </button>
                        )}
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-text-secondary">{option.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <Review
              activity={activity}
              venue={venue}
              dateLabel={dateLabel}
              slot={chosenSlot}
              lines={lines}
              subtotal={subtotal}
              fees={fees}
              total={total}
              profile={profile}
              onPay={pay}
            />
          )}

          {stage === "tickets" ? (
            <div className="fixed inset-x-0 bottom-0 z-[75] border-t border-border bg-surface">
              <div className="mx-auto flex h-[76px] w-full max-w-3xl items-center justify-between px-4">
                <div>
                  <p className="text-[13px] text-text-secondary">
                    {ticketCount} ticket{ticketCount === 1 ? "" : "s"}
                  </p>
                  <p className="text-[20px] font-extrabold text-text">{formatInr(subtotal)}</p>
                </div>
                <button
                  type="button"
                  disabled={ticketCount < 1}
                  onClick={goReview}
                  className="rounded-full bg-text px-6 py-3 text-[14px] font-extrabold text-bg disabled:opacity-40"
                >
                  {kart ? "Checkout" : "View cart"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <PhoneLoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onDone={() => {
          setLoginOpen(false);
          setProfile(readProfile());
          setStage("review");
        }}
      />
    </>
  );
}

function VisitDialog({
  activity,
  kart,
  chips,
  dateIso,
  slot,
  slots,
  canProceed,
  onDate,
  onSlot,
  onClose,
  onProceed,
}: {
  activity: Activity;
  kart: boolean;
  chips: { iso: string; label: string }[];
  dateIso: string;
  slot: string;
  slots: string[];
  canProceed: boolean;
  onDate: (iso: string) => void;
  onSlot: (slot: string) => void;
  onClose: () => void;
  onProceed: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
      <div className={`w-full rounded-[24px] bg-surface p-5 shadow-2xl ${kart ? "max-w-[720px]" : "max-w-[460px]"}`}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-extrabold text-text">When would you like to visit?</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-text-secondary">
            <X className="size-5" />
          </button>
        </div>
        {kart ? (
          <KartCalendar price={activity.price} dateIso={dateIso} slot={slot} slots={slots} onDate={onDate} onSlot={onSlot} />
        ) : (
          <>
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((item) => {
                const active = item.iso === dateIso;
                return (
                  <button
                    key={item.iso}
                    type="button"
                    onClick={() => onDate(item.iso)}
                    className={`rounded-xl border px-4 py-3 text-[14px] font-semibold ${
                      active ? "border-text bg-surface text-text" : "border-border text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[13px] text-text-muted">Note: Show starts at {showTime(activity)}</p>
          </>
        )}
        <button
          type="button"
          disabled={!canProceed}
          onClick={onProceed}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-text text-[15px] font-extrabold text-bg disabled:bg-surface-muted disabled:text-text-muted"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

function KartCalendar({
  price,
  dateIso,
  slot,
  slots,
  onDate,
  onSlot,
}: {
  price: number;
  dateIso: string;
  slot: string;
  slots: string[];
  onDate: (iso: string) => void;
  onSlot: (slot: string) => void;
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const pad = (new Date(year, month, 1).getDay() + 6) % 7;
  const label = today.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const cells = [...Array.from({ length: pad }, () => null), ...Array.from({ length: days }, (_, index) => index + 1)];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
      <div>
        <p className="text-center text-[15px] font-extrabold text-text">{label}</p>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[12px] font-semibold text-text-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />;
            const date = new Date(year, month, day);
            const iso = localIso(date);
            const past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const active = iso === dateIso;
            return (
              <button
                key={iso}
                type="button"
                disabled={past}
                onClick={() => {
                  onDate(iso);
                  onSlot("");
                }}
                className={`flex h-14 flex-col items-center justify-center rounded-xl text-[13px] font-semibold ${
                  active ? "bg-accent-soft text-accent" : past ? "text-text-muted" : "text-text hover:bg-surface-muted"
                }`}
              >
                {day}
                {!past ? <span className="text-[10px] font-bold text-accent">{formatInr(price)}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-start md:pt-10">
        {dateIso ? (
          <div className="flex flex-col gap-2">
            {slots.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSlot(item)}
                className={`rounded-xl border px-3 py-3 text-[13px] font-extrabold ${
                  slot === item ? "border-accent bg-accent-soft text-accent" : "border-border text-text"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-text-muted">Select a date to see available times</p>
        )}
      </div>
    </div>
  );
}

function Review({
  activity,
  venue,
  dateLabel,
  slot,
  lines,
  subtotal,
  fees,
  total,
  profile,
  onPay,
}: {
  activity: Activity;
  venue: string;
  dateLabel: string;
  slot: string;
  lines: (TicketOption & { count: number })[];
  subtotal: number;
  fees: number;
  total: number;
  profile: VybeProfile;
  onPay: () => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <div className="flex items-center gap-3">
          <span className="size-4 rounded-full border-4 border-accent" />
          <span className="h-px flex-1 bg-accent" />
          <span className="size-4 rounded-full border-4 border-accent" />
        </div>
        <div className="mt-2 flex justify-between text-[13px] font-semibold text-text">
          <span>Buyer details</span>
          <span>Review booking</span>
        </div>
        <h2 className="mt-8 text-[26px] font-extrabold tracking-tight text-text">Confirm details and payment</h2>
        <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-4">
          <p className="text-[15px] font-extrabold text-text">Buying tickets for {profile.name}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {profile.phone} | {profile.email} | {profile.state}
          </p>
        </div>
        <h2 className="mt-8 text-[20px] font-extrabold text-text">Payment summary</h2>
        <dl className="mt-3 space-y-3 text-[15px]">
          <div className="flex justify-between">
            <dt>Order amount</dt>
            <dd className="font-semibold">{formatInr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Fees and charges</dt>
            <dd className="font-semibold">{formatInr(fees)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-extrabold">
            <dt>Grand Total</dt>
            <dd>{formatInr(total)}</dd>
          </div>
        </dl>
      </div>
      <aside className="h-fit rounded-3xl bg-surface-muted p-4">
        <div className="flex gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
            <Image src={activity.imageUrl} alt="" fill className="object-cover" sizes="64px" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-text">{activity.title}</p>
            <p className="mt-1 text-[13px] text-text-secondary">{venue}, Hyderabad</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] font-semibold text-text">
          {dateLabel} | {slot}
        </p>
        {lines.map((line) => (
          <div key={line.id} className="mt-3 flex items-start justify-between gap-3 text-[14px]">
            <p>
              {line.count} × {line.name}
            </p>
            <p className="font-extrabold">{formatInr(line.price * line.count)}</p>
          </div>
        ))}
        <p className="mt-4 text-[13px] text-text-secondary">M-Ticket: Entry using the QR code in your app</p>
        <button
          type="button"
          onClick={onPay}
          className="mt-4 flex h-14 w-full items-center justify-between rounded-2xl bg-text px-5 text-bg"
        >
          <span>
            <span className="block text-[16px] font-extrabold">{formatInr(total)}</span>
            <span className="text-[11px] font-bold tracking-wide">TOTAL</span>
          </span>
          <span className="text-[16px] font-extrabold">Pay Now</span>
        </button>
      </aside>
    </div>
  );
}
