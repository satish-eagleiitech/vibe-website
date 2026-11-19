"use client";

import Image from "next/image";
import Link from "next/link";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import { SaveButton } from "@/components/common/SaveButton";
import { EventCardMeta } from "@/components/events/EventCardMeta";
import type { LiveEvent } from "@/types/event";
import { trackRecentView } from "@/lib/recent/storage";

type EventCardProps = {
  event: LiveEvent;
  className?: string;
};

export function EventCard({ event, className = "" }: EventCardProps) {
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
      className={`group flex w-[220px] shrink-0 snap-start flex-col sm:w-[240px] ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-[#ECECEE]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="240px"
        />
        <div className="absolute top-2.5 right-2.5 z-10">
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

type EventCarouselProps = {
  events: LiveEvent[];
};

export function EventCarousel({ events }: EventCarouselProps) {
  const { scrollerRef, pager, onScroll, scrollBy } = useRailPager();

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <RailPager
        pager={pager}
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
        prevLabel="Previous events"
        nextLabel="Next events"
      />
    </div>
  );
}
