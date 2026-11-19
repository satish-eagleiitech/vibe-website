"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { SaveButton } from "@/components/common/SaveButton";
import { EventCardMeta } from "@/components/events/EventCardMeta";
import type { EventSubcategory } from "@/lib/data/eventCategories";
import { trackRecentView } from "@/lib/recent/storage";
import type { LiveEvent } from "@/types/event";

type EventSubcategoryGridProps = {
  items: EventSubcategory[];
  events?: LiveEvent[];
  title?: string;
};

type CardModel = {
  key: string;
  href: string;
  imageUrl: string;
  title: string;
  day?: string;
  month?: string;
  venue?: string;
  city?: string;
  eventId: string;
};

/** Prefer unique events so cards don’t all show the same title/date. */
function buildUniqueCards(items: EventSubcategory[], events: LiveEvent[]): CardModel[] {
  const byId = new Map(events.map((event) => [event.id, event]));
  const used = new Set<string>();
  const unused = events.filter((event) => !items.some((item) => item.eventId === event.id));

  return items.map((item, index) => {
    let event = byId.get(item.eventId);
    if (event && used.has(event.id)) {
      event = undefined;
    }
    if (!event) {
      event = unused.find((candidate) => !used.has(candidate.id));
    }
    if (!event) {
      event = events.find((candidate) => !used.has(candidate.id));
    }

    if (event) used.add(event.id);

    const title = event?.title ?? item.label;
    const href = `/events/${event?.id ?? item.eventId}`;
    const eventId = event?.id ?? item.eventId;

    // Keep subcategory artwork; vary name/date/venue from a unique event when possible.
    const day = event?.day ?? String(((index * 3) % 27) + 1).padStart(2, "0");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = event?.month ?? months[index % months.length];

    return {
      key: item.id,
      href,
      imageUrl: item.imageUrl || event?.imageUrl || "",
      title,
      day,
      month,
      venue: event?.venue,
      city: event?.city,
      eventId,
    };
  });
}

export function EventSubcategoryGrid({
  items,
  events = [],
  title,
}: EventSubcategoryGridProps) {
  const cards = useMemo(() => buildUniqueCards(items, events), [items, events]);

  if (cards.length === 0) return null;

  return (
    <div>
      {title ? (
        <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
          {title}
        </h2>
      ) : null}
      <div
        className={`grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7 ${
          title ? "mt-4" : ""
        }`}
      >
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            onClick={() =>
              trackRecentView({
                id: card.eventId,
                title: card.title,
                href: card.href,
                imageUrl: card.imageUrl,
                meta: [card.venue, card.city].filter(Boolean).join(" · "),
                category: "events",
              })
            }
            className="group flex w-full flex-col"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute top-2 right-2 z-10">
                <SaveButton
                  label={`Save ${card.title}`}
                  itemId={card.eventId}
                  title={card.title}
                  href={card.href}
                  imageUrl={card.imageUrl}
                  meta={[card.venue, card.city].filter(Boolean).join(" · ")}
                  category="events"
                  tone="solid"
                />
              </div>
            </div>
            <EventCardMeta
              title={card.title}
              day={card.day}
              month={card.month}
              venue={card.venue}
              city={card.city}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
