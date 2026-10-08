"use client";

import Image from "next/image";
import Link from "next/link";
import { trackRecentView } from "@/lib/recent/storage";
import type { LiveEvent } from "@/types/event";

type EventListingCardProps = {
  event: LiveEvent;
};

export function EventListingCard({ event }: EventListingCardProps) {
  const dateLabel = [event.month, event.day].filter(Boolean).join(" ");
  const meta = [dateLabel, event.venue].filter(Boolean).join(" · ");

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
      </div>
      <h3 className="mt-2 line-clamp-1 text-[13px] font-semibold text-text sm:text-[14px]">
        {event.title}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-[12px] text-text-secondary">
        {meta || event.category}
      </p>
    </Link>
  );
}
