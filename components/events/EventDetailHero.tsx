"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarPlus, Clock3, MapPin } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import {
  PosterDetailLayout,
  PosterIconBadge,
  PosterInfoRow,
  PosterMapChip,
  posterPriceChipClass,
  posterChipClass,
} from "@/components/detail/PosterDetailLayout";
import { eventExploreCategories } from "@/lib/data/eventCategories";
import { formatInr } from "@/lib/format";
import { useClientNow } from "@/lib/hooks/useClientNow";
import type { LiveEvent } from "@/types/event";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function resolveEventDate(event: LiveEvent, now: Date): Date | null {
  const month = MONTHS.indexOf(event.month.slice(0, 3).toUpperCase());
  const day = Number.parseInt(event.day, 10);
  if (month < 0 || Number.isNaN(day)) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const date = new Date(today.getFullYear(), month, day, 19, 0);
  if (date < today) date.setFullYear(date.getFullYear() + 1);
  return date;
}

function calendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function categoryHref(eventId: string) {
  const match = eventExploreCategories.find((category) =>
    category.subcategories.some((item) => item.eventId === eventId),
  );
  return match ? `/events/category/${match.id}` : "/events";
}

type EventDetailHeroProps = {
  event: LiveEvent;
  place: string;
  mapsHref: string;
  children?: ReactNode;
};

export function EventDetailHero({ event, place, mapsHref, children }: EventDetailHeroProps) {
  const now = useClientNow();
  const date = useMemo(() => (now ? resolveEventDate(event, now) : null), [event, now]);

  const longDate = date
    ? date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : `${event.day} ${event.month}`;

  const calendarHref = date
    ? "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${calendarStamp(date)}/${calendarStamp(new Date(date.getTime() + 3 * 60 * 60 * 1000))}` +
      `&location=${encodeURIComponent(place)}` +
      `&details=${encodeURIComponent(event.description)}`
    : undefined;

  return (
    <PosterDetailLayout
      title={event.title}
      posterSrc={event.imageUrl}
      sentinelId="event-hero-sentinel"
      saveItem={{
        id: event.id,
        title: event.title,
        href: `/events/${event.id}`,
        imageUrl: event.imageUrl,
        meta: place,
        category: "events",
      }}
      bookHref={`/events/${event.id}/book`}
      bookLabel="Book tickets"
      priceCaption="Tickets from"
      priceValue={formatInr(event.startingPrice)}
      chips={
        <>
          <span className={posterPriceChipClass}>
            From {formatInr(event.startingPrice)}
          </span>
          <Link href={categoryHref(event.id)} className={posterChipClass}>
            {event.category}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </>
      }
      trailingChips={
        calendarHref ? (
          <a href={calendarHref} target="_blank" rel="noreferrer" className={posterChipClass}>
            <CalendarPlus className="size-3.5" />
            Add to Calendar
          </a>
        ) : null
      }
      info={
        <>
          <PosterInfoRow
            badge={
              <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-surface-muted text-text">
                <span className="text-[10px] font-extrabold tracking-wide text-text-secondary uppercase">
                  {event.month}
                </span>
                <span className="text-[18px] leading-none font-extrabold">{event.day}</span>
              </div>
            }
            title={longDate}
            subtitle={
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" />
                7:00 PM onwards · Gates open 60 min early
              </span>
            }
          />
          <PosterInfoRow
            badge={
              <PosterIconBadge>
                <MapPin className="size-5" />
              </PosterIconBadge>
            }
            title={
              <>
                {event.venue || "Venue to be announced"}
                <PosterMapChip href={mapsHref} />
              </>
            }
            subtitle={event.city || "Hyderabad"}
          />
        </>
      }
    >
      {children}
    </PosterDetailLayout>
  );
}
