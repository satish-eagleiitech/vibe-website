"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Ticket } from "lucide-react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { Container } from "@/components/common/Container";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { formatInr } from "@/lib/format";
import type { LiveEvent } from "@/types/event";

type EventCheckoutPanelProps = {
  event: LiveEvent;
  dateIso: string;
  tierId: string;
  qty: number;
};

const TIER_META: Record<
  string,
  { name: string; multiplier: number }
> = {
  general: { name: "General admission", multiplier: 1 },
  premium: { name: "Premium", multiplier: 1.6 },
  vip: { name: "VIP", multiplier: 2.4 },
};

function formatDateLabel(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateIso;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EventCheckoutPanel({
  event,
  dateIso,
  tierId,
  qty,
}: EventCheckoutPanelProps) {
  const tier = TIER_META[tierId] ?? TIER_META.general;
  const unitPrice = Math.round(event.startingPrice * (tier?.multiplier ?? 1));
  const ticketCount = Math.min(8, Math.max(1, qty));
  const subtotal = unitPrice * ticketCount;
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees;
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const [name, setName] = useState("Guest");
  const [phone, setPhone] = useState("+91 ");

  const seatLabels = useMemo(
    () =>
      Array.from({ length: ticketCount }, (_, i) => `${tier?.name} #${i + 1}`),
    [ticketCount, tier?.name],
  );

  if (!dateIso || ticketCount < 1) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-extrabold text-text">Booking incomplete</h1>
        <p className="mt-2 text-text-secondary">
          Pick a date and tickets again to checkout.
        </p>
        <Link
          href={`/events/${event.id}/book`}
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
        >
          Back to tickets
        </Link>
      </Container>
    );
  }

  if (booking) {
    return <BookingConfirmed booking={booking} />;
  }

  function confirm() {
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "events",
      title: event.title,
      posterUrl: event.imageUrl,
      meta: event.category,
      dateLabel: formatDateLabel(dateIso),
      timeLabel: "Gates open 1h before",
      venue: place || event.venue,
      seats: seatLabels,
      seatClass: tier?.name,
      theatreName: place || event.venue,
      ticketPrice: unitPrice,
      convenienceFee: fees,
      paymentMethod: "UPI",
      total,
      createdAt: new Date().toISOString(),
    };
    saveBooking(next);
    setBooking(next);
  }

  return (
    <div className="w-full pb-16">
      <Container className="grid max-w-4xl gap-8 py-8 md:grid-cols-[1fr_320px] md:py-10">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
            Checkout
          </h1>
          <div className="mt-5 flex gap-4 rounded-2xl border border-border bg-surface p-4">
            <div className="relative aspect-[2/3] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-muted">
              <Image
                src={event.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-extrabold text-text">{event.title}</p>
              <p className="mt-1 text-[13px] text-text-secondary">{place}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {formatDateLabel(dateIso)} · {tier?.name} × {ticketCount}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[13px] font-bold text-text">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-3 text-[14px] text-text outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-bold text-text">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-3 text-[14px] text-text outline-none focus:border-accent"
              />
            </label>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-[16px] font-extrabold text-text">Order summary</h2>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between gap-3">
              <dt className="text-text-secondary">Tickets</dt>
              <dd className="font-semibold text-text">{formatInr(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-text-secondary">Convenience fee</dt>
              <dd className="font-semibold text-text">{formatInr(fees)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-3 text-[16px]">
              <dt className="font-extrabold text-text">Total</dt>
              <dd className="font-extrabold text-text">{formatInr(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={confirm}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <Ticket className="size-4" />
            Pay {formatInr(total)}
          </button>
          <Link
            href={`/events/${event.id}/book`}
            className="mt-3 block text-center text-[13px] font-semibold text-text-secondary hover:text-accent"
          >
            Change tickets
          </Link>
        </aside>
      </Container>
    </div>
  );
}
