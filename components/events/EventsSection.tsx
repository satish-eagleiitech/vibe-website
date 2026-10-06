import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { EventCarousel } from "@/components/events/EventCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveEvent } from "@/types/event";

type EventsSectionProps = {
  events: LiveEvent[];
};

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="w-full pt-8 pb-4 md:pt-10 md:pb-5">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Events
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Buy tickets to the hottest events
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-[15px] font-bold text-accent"
          >
            See all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {events.length === 0 ? (
          <EmptyState title="No upcoming events yet" />
        ) : (
          <EventCarousel events={events} />
        )}
      </Container>
    </section>
  );
}
