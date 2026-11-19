"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import { SaveButton } from "@/components/common/SaveButton";
import { EventCardMeta } from "@/components/events/EventCardMeta";
import { trackRecentView } from "@/lib/recent/storage";
import type { LiveEvent } from "@/types/event";

type FeaturedEventsSectionProps = {
  events: LiveEvent[];
};

export function FeaturedEventsSection({ events }: FeaturedEventsSectionProps) {
  const { scrollerRef, pager, onScroll, scrollBy } = useRailPager();

  return (
    <section className="w-full pt-6 pb-2 md:pt-8">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          Trending Events
        </h2>

        {events.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No trending events yet" />
          </div>
        ) : (
          <div className="mt-5">
            <div
              ref={scrollerRef}
              onScroll={onScroll}
              className="hide-scrollbar flex min-w-0 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:gap-5"
            >
              {events.map((event) => (
                <FeaturedEventCard key={event.id} event={event} />
              ))}
            </div>
            <RailPager
              pager={pager}
              onPrev={() => scrollBy(-1)}
              onNext={() => scrollBy(1)}
              prevLabel="Previous trending events"
              nextLabel="Next trending events"
            />
          </div>
        )}
      </Container>
    </section>
  );
}

function FeaturedEventCard({ event }: { event: LiveEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      onClick={() =>
        trackRecentView({
          id: event.id,
          title: event.title,
          href: `/events/${event.id}`,
          imageUrl: event.imageUrl,
          meta: [event.venue, event.city].filter(Boolean).join(" · "),
          category: "events",
        })
      }
      data-rail-card
      className="group flex w-[168px] shrink-0 snap-start flex-col sm:w-[188px] md:w-[200px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-muted">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="200px"
        />
        <div className="absolute top-2 right-2 z-10">
          <SaveButton
            label={`Save ${event.title}`}
            itemId={event.id}
            title={event.title}
            href={`/events/${event.id}`}
            imageUrl={event.imageUrl}
            meta={[event.venue, event.city].filter(Boolean).join(" · ")}
            category="events"
            tone="solid"
          />
        </div>
      </div>
      <EventCardMeta
        title={event.title}
        day={event.day}
        month={event.month}
        venue={event.venue}
        city={event.city}
      />
    </Link>
  );
}
