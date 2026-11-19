import type { LiveEvent } from "@/types/event";

export type EventSubcategory = {
  id: string;
  label: string;
  imageUrl: string;
  eventId: string;
};

export type EventExploreCategory = {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  subcategories: EventSubcategory[];
};

/** District-style explore chips for /events, each with related types. */
export const eventExploreCategories: EventExploreCategory[] = [
  {
    id: "music",
    label: "Music",
    href: "/events?category=music#all-events",
    imageUrl: "/images/explore/events/music.jpg",
    subcategories: [
      { id: "concerts", label: "Concerts", imageUrl: "/images/events/poster-08.jpg", eventId: "event-rock-revival" },
      { id: "live-bands", label: "Live bands", imageUrl: "/images/events/poster-04.jpg", eventId: "event-indie-yard" },
      { id: "jazz", label: "Jazz", imageUrl: "/images/events/poster-09.jpg", eventId: "event-jazz-lounge" },
      { id: "music-fests", label: "Music fests", imageUrl: "/images/events/poster-01.jpg", eventId: "event-neon-arena" },
      { id: "folk", label: "Folk", imageUrl: "/images/events/poster-06.jpg", eventId: "event-folk-fusion" },
    ],
  },
  {
    id: "nightlife",
    label: "Nightlife",
    href: "/events?category=nightlife#all-events",
    imageUrl: "/images/explore/events/nightlife.jpg",
    subcategories: [
      { id: "dj-nights", label: "DJ nights", imageUrl: "/images/events/subcats/dj-nights.jpg", eventId: "event-dj-night" },
      { id: "club-nights", label: "Club nights", imageUrl: "/images/events/subcats/club-nights.jpg", eventId: "event-dj-night" },
      { id: "rooftop", label: "Rooftop sets", imageUrl: "/images/events/poster-16.jpg", eventId: "event-sunset-date" },
    ],
  },
  {
    id: "comedy",
    label: "Comedy",
    href: "/events?category=comedy#all-events",
    imageUrl: "/images/explore/events/comedy.jpg",
    subcategories: [
      { id: "standup", label: "Standup", imageUrl: "/images/events/poster-02.jpg", eventId: "event-city-stories" },
      { id: "comedy-circuit", label: "Comedy circuit", imageUrl: "/images/events/poster-10.jpg", eventId: "event-comedy-circuit" },
      { id: "open-mic", label: "Open mic", imageUrl: "/images/events/poster-07.jpg", eventId: "event-poetry-jam" },
    ],
  },
  {
    id: "sports",
    label: "Sports",
    href: "/events?category=sports#all-events",
    imageUrl: "/images/explore/events/sports.jpg",
    subcategories: [
      { id: "arena", label: "Arena nights", imageUrl: "/images/events/poster-01.jpg", eventId: "event-neon-arena" },
      { id: "grounds", label: "Ground events", imageUrl: "/images/events/subcats/ground-events.jpg", eventId: "event-folk-fusion" },
      { id: "stadium", label: "Stadium shows", imageUrl: "/images/events/poster-08.jpg", eventId: "event-rock-revival" },
    ],
  },
  {
    id: "performances",
    label: "Performances",
    href: "/events?category=performances#all-events",
    imageUrl: "/images/explore/events/performances.jpg",
    subcategories: [
      { id: "theatre", label: "Theatre", imageUrl: "/images/events/poster-11.jpg", eventId: "event-theatre-night" },
      { id: "spoken-word", label: "Spoken word", imageUrl: "/images/events/poster-07.jpg", eventId: "event-poetry-jam" },
      { id: "plays", label: "Plays", imageUrl: "/images/explore/events/performances.jpg", eventId: "event-theatre-night" },
    ],
  },
  {
    id: "food",
    label: "Food & Drinks",
    href: "/events?category=food#all-events",
    imageUrl: "/images/explore/events/food.jpg",
    subcategories: [
      { id: "food-fests", label: "Food fests", imageUrl: "/images/events/poster-12.jpg", eventId: "event-food-music" },
      { id: "street-food", label: "Street food", imageUrl: "/images/explore/events/food.jpg", eventId: "event-sunday-fair" },
      { id: "dinner-sets", label: "Dinner sets", imageUrl: "/images/events/poster-16.jpg", eventId: "event-sunset-date" },
    ],
  },
  {
    id: "social",
    label: "Social Mixers",
    href: "/events?category=social#all-events",
    imageUrl: "/images/explore/events/social.jpg",
    subcategories: [
      { id: "mixers", label: "Mixers", imageUrl: "/images/explore/events/social.jpg", eventId: "event-poetry-jam" },
      { id: "community", label: "Community", imageUrl: "/images/events/poster-15.jpg", eventId: "event-sunday-fair" },
      { id: "jam-sessions", label: "Jam sessions", imageUrl: "/images/events/poster-04.jpg", eventId: "event-indie-yard" },
    ],
  },
  {
    id: "screenings",
    label: "Screenings",
    href: "/events?category=screenings#all-events",
    imageUrl: "/images/explore/events/screenings.jpg",
    subcategories: [
      { id: "film-scores", label: "Film scores", imageUrl: "/images/events/poster-03.jpg", eventId: "event-candlelight" },
      { id: "live-cinema", label: "Live cinema", imageUrl: "/images/explore/events/screenings.jpg", eventId: "event-candlelight" },
    ],
  },
  {
    id: "fitness",
    label: "Fitness",
    href: "/events?category=fitness#all-events",
    imageUrl: "/images/explore/events/fitness.jpg",
    subcategories: [
      { id: "yoga", label: "Yoga", imageUrl: "/images/explore/events/fitness.jpg", eventId: "event-slow-sunday" },
      { id: "outdoor", label: "Outdoor sessions", imageUrl: "/images/events/event-12.jpg", eventId: "event-slow-sunday" },
    ],
  },
  {
    id: "expos",
    label: "Expos",
    href: "/events?category=expos#all-events",
    imageUrl: "/images/explore/events/expos.jpg",
    subcategories: [
      { id: "city-expo", label: "City expo", imageUrl: "/images/events/poster-13.jpg", eventId: "event-city-expo" },
      { id: "brand-shows", label: "Brand shows", imageUrl: "/images/explore/events/expos.jpg", eventId: "event-city-expo" },
    ],
  },
  {
    id: "art",
    label: "Art Exhibitions",
    href: "/events?category=art#all-events",
    imageUrl: "/images/explore/events/art.jpg",
    subcategories: [
      { id: "gallery", label: "Gallery walks", imageUrl: "/images/events/poster-14.jpg", eventId: "event-art-walk" },
      { id: "live-art", label: "Live painting", imageUrl: "/images/explore/events/art.jpg", eventId: "event-art-walk" },
    ],
  },
  {
    id: "fests",
    label: "Fest & Fairs",
    href: "/events?category=fests#all-events",
    imageUrl: "/images/explore/events/fests.jpg",
    subcategories: [
      { id: "fairs", label: "Weekend fairs", imageUrl: "/images/events/poster-15.jpg", eventId: "event-sunday-fair" },
      { id: "festivals", label: "Festivals", imageUrl: "/images/events/poster-06.jpg", eventId: "event-folk-fusion" },
      { id: "carnival", label: "Carnival", imageUrl: "/images/explore/events/fests.jpg", eventId: "event-family-carnival" },
    ],
  },
  {
    id: "romantic",
    label: "Romantic",
    href: "/events?category=romantic#all-events",
    imageUrl: "/images/explore/events/romantic.jpg",
    subcategories: [
      { id: "date-nights", label: "Date nights", imageUrl: "/images/events/poster-16.jpg", eventId: "event-sunset-date" },
      { id: "candlelight", label: "Candlelight", imageUrl: "/images/events/poster-03.jpg", eventId: "event-candlelight" },
    ],
  },
  {
    id: "chill",
    label: "Chill",
    href: "/events?category=chill#all-events",
    imageUrl: "/images/explore/events/chill.jpg",
    subcategories: [
      { id: "slow-days", label: "Slow Sundays", imageUrl: "/images/events/event-12.jpg", eventId: "event-slow-sunday" },
      { id: "lounge", label: "Lounge", imageUrl: "/images/events/poster-09.jpg", eventId: "event-jazz-lounge" },
    ],
  },
  {
    id: "family",
    label: "Family",
    href: "/events?category=family#all-events",
    imageUrl: "/images/explore/events/family.jpg",
    subcategories: [
      { id: "carnival-day", label: "Carnival day", imageUrl: "/images/events/event-3.jpg", eventId: "event-family-carnival" },
      { id: "picnic", label: "Picnic fairs", imageUrl: "/images/events/poster-15.jpg", eventId: "event-sunday-fair" },
    ],
  },
];

export function findEventCategory(id: string) {
  const needle = id.trim().toLowerCase();
  if (!needle) return null;
  return (
    eventExploreCategories.find(
      (category) => category.id === needle || category.label.toLowerCase() === needle,
    ) ??
    eventExploreCategories.find((category) => category.label.toLowerCase().startsWith(needle)) ??
    null
  );
}

export function allEventSubcategories() {
  return eventExploreCategories.flatMap((category) =>
    category.subcategories.map((item) => ({
      ...item,
      href: `/events/${item.eventId}`,
      parentId: category.id,
    })),
  );
}

export function matchesEventCategory(event: LiveEvent, category?: string) {
  if (!category) return true;
  const needle = category.trim().toLowerCase();
  const resolved = findEventCategory(needle);
  const key = resolved?.id ?? needle;
  const hay = `${event.category} ${event.title} ${event.venue} ${event.description ?? ""}`.toLowerCase();

  if (key === "music") return /music|concert|indie|rock|jazz|folk|dj|neon|arena|band/.test(hay);
  if (key === "nightlife") return /night|club|dj|skyline|rooftop|aura/.test(hay);
  if (key === "comedy") return /comedy|standup|comic|stories/.test(hay);
  if (key === "food") return /food|taste|bass|dining|brunch/.test(hay);
  if (key === "sports") return /sport|arena|stadium|match|ground/.test(hay);
  if (key === "performances") return /theatre|performance|play|poetry|spoken|black box/.test(hay);
  if (key === "social") return /social|mixer|jam|poetry|fair/.test(hay);
  if (key === "screenings") return /screen|film|cinema|score|candlelight/.test(hay);
  if (key === "fitness") return /fitness|yoga|run|chill|slow sunday/.test(hay);
  if (key === "expos") return /expo|exhibition|hitex/.test(hay);
  if (key === "art") return /art|gallery|walk|painting/.test(hay);
  if (key === "fests") return /fest|fair|carnival|folk/.test(hay);
  if (key === "romantic") return /romantic|candle|date|sunset/.test(hay);
  if (key === "chill") return /chill|lounge|jazz|acoustic|slow|vinyl/.test(hay);
  if (key === "family") return /family|kids|fair|carnival/.test(hay);
  return hay.includes(needle) || (resolved ? hay.includes(resolved.label.toLowerCase()) : false);
}

const MONTH_INDEX: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

/** Reference “today” for mock when-filters (matches demo calendar). */
const FILTER_TODAY = new Date(2026, 10, 19);

function eventDate(event: LiveEvent): Date | null {
  const month = MONTH_INDEX[event.month?.trim().toUpperCase() ?? ""];
  const day = Number.parseInt(event.day ?? "", 10);
  if (month == null || !Number.isFinite(day)) return null;
  let year = FILTER_TODAY.getFullYear();
  const date = new Date(year, month, day);
  if (date < FILTER_TODAY) date.setFullYear(year + 1);
  return date;
}

export function matchesEventWhen(event: LiveEvent, when?: string) {
  if (!when) return true;
  const date = eventDate(event);
  if (!date) return false;

  const start = new Date(FILTER_TODAY);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(0, 0, 0, 0);

  if (when === "today") {
    return end.getTime() === start.getTime();
  }
  if (when === "tomorrow") {
    const tomorrow = new Date(start);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return end.getTime() === tomorrow.getTime();
  }
  if (when === "weekend") {
    const day = end.getDay(); // 0 Sun … 6 Sat
    const diffDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    // Fri–Sun counts as “this weekend” window for mock listings
    return (day === 0 || day === 5 || day === 6) && diffDays >= 0 && diffDays <= 10;
  }
  return true;
}

export function filterEvents(
  events: LiveEvent[],
  opts: { category?: string; when?: string } = {},
) {
  return events.filter(
    (event) =>
      matchesEventCategory(event, opts.category) && matchesEventWhen(event, opts.when),
  );
}
