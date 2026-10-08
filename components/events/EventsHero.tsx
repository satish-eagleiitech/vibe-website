import { Ticket } from "lucide-react";
import { MarqueeHero, type MarqueeHeroTile } from "@/components/common/MarqueeHero";
import type { LiveEvent } from "@/types/event";

type EventsHeroProps = {
  events: LiveEvent[];
};

const FALLBACK_IMAGES = Array.from(
  { length: 16 },
  (_, index) => `/images/events/poster-${String(index + 1).padStart(2, "0")}.jpg`,
);

function uniqueTiles(events: LiveEvent[]): MarqueeHeroTile[] {
  const seen = new Set<string>();
  const tiles: MarqueeHeroTile[] = [];

  for (const event of events) {
    if (!event.imageUrl || seen.has(event.imageUrl)) continue;
    seen.add(event.imageUrl);
    tiles.push({
      src: event.imageUrl,
      alt: event.title,
      href: `/events/${event.id}`,
    });
  }

  for (const src of FALLBACK_IMAGES) {
    if (seen.has(src)) continue;
    seen.add(src);
    tiles.push({ src, alt: "Events on VYBE", href: "/events#all-events" });
  }

  return tiles;
}

export function EventsHero({ events }: EventsHeroProps) {
  return (
    <MarqueeHero
      eyebrow="Events on VYBE"
      title="Nights worth showing up for"
      description={
        <>
          Concerts, comedy, fests, and late-night gigs across Hyderabad — grab
          tickets in a few taps.
        </>
      }
      primary={{
        href: "/events#all-events",
        label: "Browse events",
        icon: <Ticket className="size-5" />,
      }}
      secondary={{ href: "/events#explore-events", label: "Explore categories" }}
      tiles={uniqueTiles(events)}
    />
  );
}
