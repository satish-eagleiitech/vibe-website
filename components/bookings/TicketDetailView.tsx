"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock,
  LifeBuoy,
  MapPin,
  Navigation,
  Share2,
  Ticket,
} from "lucide-react";
import { FauxQr } from "@/components/bookings/FauxQr";
import { seedBookings } from "@/lib/bookings/seeds";
import {
  getBookingById,
  type BookingCategory,
  type VybeBooking,
} from "@/lib/bookings/storage";

const CATEGORY_LABEL: Record<BookingCategory, string> = {
  movies: "Movies",
  events: "Events",
  play: "Game Zone",
  activities: "Activities",
};

const SEAT_LABEL: Record<BookingCategory, string> = {
  movies: "Seats",
  events: "Passes",
  play: "Slot",
  activities: "Guests",
};

const TIPS: Record<BookingCategory, string[]> = {
  movies: [
    "Arrive 20 minutes before showtime for security checks.",
    "Outside food and beverages are not allowed.",
    "Carry a valid ID for age-restricted films.",
  ],
  events: [
    "Gates open 60 minutes before the event starts.",
    "Each pass admits one person. Keep your QR handy.",
    "Re-entry may not be allowed once you exit.",
  ],
  play: [
    "Report 15 minutes early to collect gear.",
    "Wear closed shoes for bowling, karting and VR.",
    "Slots run on time; late arrivals may lose minutes.",
  ],
  activities: [
    "Carry a valid photo ID for verification at entry.",
    "Arrive 15 minutes before your booked slot.",
    "Follow venue safety instructions at all times.",
  ],
};

function findBooking(id: string) {
  return getBookingById(id) ?? seedBookings.find((item) => item.id === id) ?? null;
}

function formatBookedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function groupCode(code: string) {
  return code.replace(/(.{4})/g, "$1 ").trim();
}

export function TicketDetailView({ id }: { id: string }) {
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const load = () => {
      setBooking(findBooking(id));
      setReady(true);
    };
    load();
  }, [id]);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="h-[560px] animate-pulse rounded-[28px] bg-surface" />
        <div className="h-72 animate-pulse rounded-[24px] bg-surface" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rounded-[24px] border border-border bg-surface px-6 py-14 text-center">
        <Ticket className="mx-auto size-10 text-text-muted" />
        <h1 className="mt-3 text-[20px] font-extrabold text-text">Ticket not found</h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          It may have been removed from this device.
        </p>
        <Link
          href="/tickets"
          className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to bookings
        </Link>
      </div>
    );
  }

  const current = booking;
  const chips = [
    current.language
      ? current.language.charAt(0).toUpperCase() + current.language.slice(1)
      : null,
    current.format,
    current.certification,
    current.seatClass,
  ].filter(Boolean) as string[];

  const facts = [
    { label: "Date", value: current.dateLabel },
    { label: "Time", value: current.timeLabel },
    {
      label: SEAT_LABEL[current.category],
      value: current.seats.length ? current.seats.join(", ") : "—",
    },
    current.audi
      ? { label: "Screen", value: current.audi }
      : { label: "Type", value: current.format || current.meta },
  ];

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    current.theatreName || current.venue,
  )}`;

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: current.title, text: `My VYBE ticket for ${current.title}`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/tickets?tab=${current.category}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-text transition-colors hover:border-accent/40 hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Bookings
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[12px] font-extrabold text-emerald-600 dark:text-emerald-400">
          <Check className="size-3.5" />
          Booking confirmed
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <article className="@container overflow-hidden rounded-[28px] border border-border bg-surface">
          <div className="relative h-52 overflow-hidden bg-sidebar @lg:h-60">
            <Image
              src={current.posterUrl}
              alt=""
              fill
              className="scale-110 object-cover opacity-60 blur-md"
              sizes="(max-width: 1280px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 @lg:p-6">
              <div className="relative hidden h-[132px] w-[92px] shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/15 @sm:block">
                <Image
                  src={current.posterUrl}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="92px"
                />
              </div>
              <div className="min-w-0 pb-1 text-white">
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] uppercase">
                  {CATEGORY_LABEL[current.category]}
                </span>
                <h1 className="mt-2 line-clamp-2 text-[22px] leading-tight font-extrabold @lg:text-[28px]">
                  {current.title}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/75">
                  <MapPin className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{current.theatreName || current.venue}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 @lg:p-6">
            {chips.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-bold text-text-secondary"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
            <dl className="grid grid-cols-2 gap-3 @xl:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0 rounded-2xl bg-surface-muted px-3.5 py-3">
                  <dt className="text-[10px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 line-clamp-2 text-[14px] leading-snug font-extrabold break-words text-text">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-4 border-t-2 border-dashed border-border @lg:mx-6">
            <span className="absolute top-0 -left-[30px] size-7 -translate-y-1/2 rounded-full bg-bg @lg:-left-[38px] lg:bg-dash" />
            <span className="absolute top-0 -right-[30px] size-7 -translate-y-1/2 rounded-full bg-bg @lg:-right-[38px] lg:bg-dash" />
          </div>

          <div className="flex flex-col items-center gap-5 p-4 @lg:flex-row @lg:items-center @lg:p-6">
            <div className="rounded-2xl border border-border bg-white p-2.5 shadow-sm">
              <FauxQr value={current.bookingCode || current.id} className="size-36 @lg:size-40" />
            </div>
            <div className="w-full min-w-0 text-center @lg:text-left">
              <p className="text-[15px] font-extrabold text-text">Show this QR at the entry</p>
              <p className="mt-0.5 text-[12px] text-text-secondary">
                Screenshots work too. Brightness up helps the scanner.
              </p>
              <dl className="mt-4 grid grid-cols-1 gap-2.5 text-left @md:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-dashed border-border px-3.5 py-2.5">
                  <dt className="text-[10px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                    Booking ID
                  </dt>
                  <dd className="mt-0.5 truncate font-mono text-[13px] font-bold text-text">
                    {current.id}
                  </dd>
                </div>
                <div className="min-w-0 rounded-2xl border border-dashed border-border px-3.5 py-2.5">
                  <dt className="text-[10px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                    Booked on
                  </dt>
                  <dd className="mt-0.5 truncate text-[13px] font-bold text-text">
                    {formatBookedAt(current.createdAt)}
                  </dd>
                </div>
                {current.bookingCode ? (
                  <div className="min-w-0 rounded-2xl border border-dashed border-border px-3.5 py-2.5 @md:col-span-2">
                    <dt className="text-[10px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                      Ticket code
                    </dt>
                    <dd className="mt-0.5 font-mono text-[13px] font-bold tracking-wider break-all text-text">
                      {groupCode(current.bookingCode)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </article>

        <aside className="space-y-4 xl:sticky xl:top-[calc(var(--vybe-header-h)+2.5rem)] xl:self-start">
          <div className="grid grid-cols-3 gap-2.5 xl:grid-cols-1">
            <button
              type="button"
              onClick={share}
              className="flex flex-col items-center gap-1.5 rounded-[20px] bg-accent px-3 py-3.5 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(255,0,91,0.25)] transition-opacity hover:opacity-90 xl:flex-row xl:justify-center xl:gap-2 xl:text-[13px]"
            >
              {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
              {shared ? "Shared" : "Share ticket"}
            </button>
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-[20px] border border-border bg-surface px-3 py-3.5 text-[12px] font-extrabold text-text transition-colors hover:border-accent/40 hover:text-accent xl:flex-row xl:justify-center xl:gap-2 xl:text-[13px]"
            >
              <Navigation className="size-4" />
              Directions
            </a>
            <Link
              href="/help-center"
              className="flex flex-col items-center gap-1.5 rounded-[20px] border border-border bg-surface px-3 py-3.5 text-[12px] font-extrabold text-text transition-colors hover:border-accent/40 hover:text-accent xl:flex-row xl:justify-center xl:gap-2 xl:text-[13px]"
            >
              <LifeBuoy className="size-4" />
              Get help
            </Link>
          </div>

          <div className="rounded-[24px] bg-sidebar p-5 text-white">
            <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent uppercase">
              <Clock className="size-3.5" />
              Before you go
            </p>
            <ul className="mt-3 space-y-3">
              {TIPS[current.category].map((tip) => (
                <li key={tip} className="flex gap-2.5 text-[13px] leading-snug text-white/75">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-[12px] text-white/55">
              {current.venue}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
