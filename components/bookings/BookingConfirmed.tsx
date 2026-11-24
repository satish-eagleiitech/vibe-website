"use client";

import Link from "next/link";
import { TicketPass } from "@/components/bookings/TicketPass";
import { Container } from "@/components/common/Container";
import type { VybeBooking } from "@/lib/bookings/storage";

type BookingConfirmedProps = {
  booking: VybeBooking;
};

export function BookingConfirmed({ booking }: BookingConfirmedProps) {
  return (
    <div className="w-full bg-bg">
      <Container className="flex max-w-xl flex-col justify-center py-5 sm:py-6 md:min-h-[calc(100svh-var(--vybe-header-h))] md:py-8">
        <div className="vybe-confirm-rise mb-3 text-center sm:mb-4">
          <p className="text-[12px] font-bold tracking-[0.14em] text-accent uppercase">
            You&apos;re all set
          </p>
          <h1 className="mt-1.5 text-[22px] font-extrabold tracking-tight text-text sm:text-[26px]">
            Booking confirmed
          </h1>
        </div>

        <div className="vybe-confirm-pop">
          <TicketPass booking={booking} />
        </div>

        <div className="vybe-confirm-rise mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-5" style={{ animationDelay: "280ms" }}>
          <Link
            href={`/tickets/${booking.id}`}
            className="rounded-full bg-accent px-5 py-2.5 text-[13px] font-bold text-white"
          >
            View ticket
          </Link>
          <Link
            href={`/tickets?tab=${booking.category}`}
            className="rounded-full bg-surface-muted px-5 py-2.5 text-[13px] font-bold text-text"
          >
            My bookings
          </Link>
        </div>
      </Container>
    </div>
  );
}
