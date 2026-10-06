"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { RailPager, useRailPager } from "@/components/common/RailPager";
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
      </div>
      <div className="pt-3">
        <div className="flex items-start gap-1 text-[12px] text-accent">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold text-text">
          {event.title}
        </h3>
        <p className="mt-0.5 text-[12px] text-text-secondary">
          {event.month} {event.day}
          {event.city ? ` · ${event.city}` : ""}
        </p>
      </div>
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
