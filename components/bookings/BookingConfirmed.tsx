"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { TicketPass } from "@/components/bookings/TicketPass";
import { Container } from "@/components/common/Container";
import type { VybeBooking } from "@/lib/bookings/storage";

type BookingConfirmedProps = {
  booking: VybeBooking;
};

export function BookingConfirmed({ booking }: BookingConfirmedProps) {
  return (
    <div className="w-full bg-bg pb-16">
      <Container className="max-w-xl py-10 md:py-14">
        <div className="mb-6 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
            <CheckCircle2 className="size-8" strokeWidth={2.5} />
          </span>
          <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-text md:text-[32px]">
            Booking confirmed
          </h1>
        </div>

        <TicketPass booking={booking} />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/tickets/${booking.id}`}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
          >
            View ticket
          </Link>
          <Link
            href={`/tickets?tab=${booking.category}`}
            className="rounded-full bg-surface-muted px-6 py-3 text-sm font-bold text-text"
          >
            My bookings
          </Link>
        </div>
      </Container>
    </div>
  );
}
