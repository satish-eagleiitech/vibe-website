"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { findEventSection } from "@/lib/events/sections";
import { formatInr } from "@/lib/format";
import { DEFAULT_PROFILE, readProfile, type VybeProfile } from "@/lib/profile/storage";
import type { LiveEvent } from "@/types/event";

type EventCheckoutPanelProps = {
  event: LiveEvent;
  dateIso: string;
  timeLabel: string;
  tierId: string;
  qty: number;
};

function clock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  return `${String(mins).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function EventCheckoutPanel({ event, dateIso, timeLabel, tierId, qty }: EventCheckoutPanelProps) {
  const section = findEventSection(event.startingPrice, tierId);
  const ticketCount = Math.min(8, Math.max(1, qty));
  const subtotal = section.price * ticketCount;
  const fees = Math.max(8, Math.round(subtotal * 0.012));
  const total = subtotal + fees;
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const [booking, setBooking] = useState<VybeBooking | null>(null);
  const [left, setLeft] = useState(9 * 60 + 37);
  const [profile, setProfile] = useState<VybeProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(readProfile());
    const timer = window.setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!dateIso || !section) {
    return (
      <div className="px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-text">Booking incomplete</h1>
        <Link href={`/events/${event.id}/book`} className="mt-6 inline-flex rounded-full bg-text px-6 py-3 text-sm font-bold text-bg">
          Back to sections
        </Link>
      </div>
    );
  }

  if (booking) return <BookingConfirmed booking={booking} />;

  function confirm() {
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "events",
      title: event.title,
      posterUrl: event.imageUrl,
      meta: event.category,
      dateLabel: dateIso,
      timeLabel,
      venue: place || event.venue,
      seats: Array.from({ length: ticketCount }, (_, index) => `${section.name} ${index + 1}`),
      seatClass: section.name,
      theatreName: place || event.venue,
      ticketPrice: section.price,
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
      <h1 className="px-4 pt-5 text-center text-[18px] font-extrabold text-text md:text-[20px]">{event.title}</h1>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-[#e7f8ef] px-4 py-2.5 text-[13px] font-semibold text-[#1c7a45]">
        <span>Pay only 50% to reserve your booking</span>
        <span>Complete your booking in {clock(left)} mins</span>
      </div>

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
          <div className="mt-4 flex items-start justify-between rounded-2xl border border-border bg-surface px-4 py-4">
            <div>
              <p className="text-[15px] font-extrabold text-text">Buying tickets for {profile.name}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {profile.phone} | {profile.email} | {profile.state}
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-[20px] font-extrabold text-text">Payment summary</h2>
          <dl className="mt-3 space-y-3 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-text">Order amount</dt>
              <dd className="font-semibold text-text">{formatInr(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text">Fees and charges</dt>
              <dd className="font-semibold text-text">{formatInr(fees)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-extrabold text-text">Grand Total</dt>
              <dd className="font-extrabold text-text">{formatInr(total)}</dd>
            </div>
          </dl>
        </div>

        <aside className="h-fit rounded-3xl bg-surface-muted p-4">
          <div className="flex gap-3">
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
              <Image src={event.imageUrl} alt="" fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-text">{event.title}</p>
              <p className="mt-1 text-[13px] text-text-secondary">{place}</p>
            </div>
          </div>
          <p className="mt-4 text-[14px] font-semibold text-text">
            {dateIso} | {timeLabel}
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <p className="text-[14px] text-text">
              {ticketCount} × {section.name}
            </p>
            <div className="text-right">
              <p className="font-extrabold text-text">{formatInr(subtotal)}</p>
              <Link href={`/events/${event.id}/book`} className="text-[12px] font-semibold text-accent">
                Remove
              </Link>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-text-secondary">M-Ticket: Entry using the QR code in your app</p>
          <div className="mt-4 rounded-2xl bg-accent-soft px-4 py-3 text-[13px] font-semibold text-accent">
            Pay only 50% to reserve your booking
          </div>
          <button
            type="button"
            onClick={confirm}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-text text-[15px] font-extrabold text-bg"
          >
            Choose how to pay
          </button>
        </aside>
      </div>
    </div>
  );
}
