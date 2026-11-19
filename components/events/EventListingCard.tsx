"use client";

import Image from "next/image";
import Link from "next/link";
import { SaveButton } from "@/components/common/SaveButton";
import { EventCardMeta } from "@/components/events/EventCardMeta";
import { trackRecentView } from "@/lib/recent/storage";
import type { LiveEvent } from "@/types/event";

type EventListingCardProps = {
  event: LiveEvent;
};

export function EventListingCard({ event }: EventListingCardProps) {
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
      className="group flex w-full flex-col"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
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
