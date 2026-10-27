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
    href: "/events/category/music",
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
    href: "/events/category/nightlife",
    imageUrl: "/images/explore/events/nightlife.jpg",
    subcategories: [
      { id: "dj-nights", label: "DJ nights", imageUrl: "/images/events/poster-05.jpg", eventId: "event-dj-night" },
      { id: "club-nights", label: "Club nights", imageUrl: "/images/explore/events/nightlife.jpg", eventId: "event-dj-night" },
      { id: "rooftop", label: "Rooftop sets", imageUrl: "/images/events/poster-16.jpg", eventId: "event-sunset-date" },
    ],
  },
  {
    id: "comedy",
    label: "Comedy",
    href: "/events/category/comedy",
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
    href: "/events/category/sports",
    imageUrl: "/images/explore/events/sports.jpg",
    subcategories: [
      { id: "arena", label: "Arena nights", imageUrl: "/images/events/poster-01.jpg", eventId: "event-neon-arena" },
      { id: "grounds", label: "Ground events", imageUrl: "/images/explore/events/sports.jpg", eventId: "event-folk-fusion" },
      { id: "stadium", label: "Stadium shows", imageUrl: "/images/events/poster-08.jpg", eventId: "event-rock-revival" },
    ],
  },
  {
    id: "performances",
    label: "Performances",
    href: "/events/category/performances",
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
    href: "/events/category/food",
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
    href: "/events/category/social",
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
    href: "/events/category/screenings",
    imageUrl: "/images/explore/events/screenings.jpg",
    subcategories: [
      { id: "film-scores", label: "Film scores", imageUrl: "/images/events/poster-03.jpg", eventId: "event-candlelight" },
      { id: "live-cinema", label: "Live cinema", imageUrl: "/images/explore/events/screenings.jpg", eventId: "event-candlelight" },
    ],
  },
  {
    id: "fitness",
    label: "Fitness",
    href: "/events/category/fitness",
    imageUrl: "/images/explore/events/fitness.jpg",
    subcategories: [
      { id: "yoga", label: "Yoga", imageUrl: "/images/explore/events/fitness.jpg", eventId: "event-slow-sunday" },
      { id: "outdoor", label: "Outdoor sessions", imageUrl: "/images/events/event-12.jpg", eventId: "event-slow-sunday" },
    ],
  },
  {
    id: "expos",
    label: "Expos",
    href: "/events/category/expos",
    imageUrl: "/images/explore/events/expos.jpg",
    subcategories: [
      { id: "city-expo", label: "City expo", imageUrl: "/images/events/poster-13.jpg", eventId: "event-city-expo" },
      { id: "brand-shows", label: "Brand shows", imageUrl: "/images/explore/events/expos.jpg", eventId: "event-city-expo" },
    ],
  },
  {
    id: "art",
    label: "Art Exhibitions",
    href: "/events/category/art",
    imageUrl: "/images/explore/events/art.jpg",
    subcategories: [
      { id: "gallery", label: "Gallery walks", imageUrl: "/images/events/poster-14.jpg", eventId: "event-art-walk" },
      { id: "live-art", label: "Live painting", imageUrl: "/images/explore/events/art.jpg", eventId: "event-art-walk" },
    ],
  },
  {
    id: "fests",
    label: "Fest & Fairs",
    href: "/events/category/fests",
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
    href: "/events/category/romantic",
    imageUrl: "/images/explore/events/romantic.jpg",
    subcategories: [
      { id: "date-nights", label: "Date nights", imageUrl: "/images/events/poster-16.jpg", eventId: "event-sunset-date" },
      { id: "candlelight", label: "Candlelight", imageUrl: "/images/events/poster-03.jpg", eventId: "event-candlelight" },
    ],
  },
  {
    id: "chill",
    label: "Chill",
    href: "/events/category/chill",
    imageUrl: "/images/explore/events/chill.jpg",
    subcategories: [
      { id: "slow-days", label: "Slow Sundays", imageUrl: "/images/events/event-12.jpg", eventId: "event-slow-sunday" },
      { id: "lounge", label: "Lounge", imageUrl: "/images/events/poster-09.jpg", eventId: "event-jazz-lounge" },
    ],
  },
  {
    id: "family",
    label: "Family",
    href: "/events/category/family",
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
  const needle = category.toLowerCase();
  const hay = `${event.category} ${event.title}`.toLowerCase();
  if (needle === "music") return /music|concert|indie|rock|jazz|folk|dj/.test(hay);
  if (needle === "nightlife") return /night|club|dj|skyline|rooftop/.test(hay);
  if (needle === "comedy") return /comedy|standup|comic|poetry/.test(hay);
  if (needle === "food") return /food|taste|dining|brunch/.test(hay);
  if (needle === "sports") return /sport|arena|stadium|match/.test(hay);
  if (needle === "performances") return /theatre|performance|play|poetry|spoken/.test(hay);
  if (needle === "social") return /social|mixer|jam|poetry|fair/.test(hay);
  if (needle === "screenings") return /screen|film|cinema|score|candlelight/.test(hay);
  if (needle === "fitness") return /fitness|yoga|run|chill|slow sunday/.test(hay);
  if (needle === "expos") return /expo|exhibition|hitex/.test(hay);
  if (needle === "art") return /art|gallery|poetry|painting/.test(hay);
  if (needle === "fests") return /fest|fair|carnival|folk/.test(hay);
  if (needle === "romantic") return /romantic|candle|date|sunset/.test(hay);
  if (needle === "chill") return /chill|lounge|jazz|acoustic|slow/.test(hay);
  if (needle === "family") return /family|kids|fair|carnival/.test(hay);
  return hay.includes(needle);
}
