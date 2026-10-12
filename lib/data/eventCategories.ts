export type EventExploreCategory = {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
};

/** District-style explore chips for /events */
export const eventExploreCategories: EventExploreCategory[] = [
  {
    id: "music",
    label: "Music",
    href: "/events?category=Music",
    imageUrl: "/images/explore/events/music.jpg",
  },
  {
    id: "nightlife",
    label: "Nightlife",
    href: "/events?category=Nightlife",
    imageUrl: "/images/explore/events/nightlife.jpg",
  },
  {
    id: "comedy",
    label: "Comedy",
    href: "/events?category=Comedy",
    imageUrl: "/images/explore/events/comedy.jpg",
  },
  {
    id: "sports",
    label: "Sports",
    href: "/events?category=Sports",
    imageUrl: "/images/explore/events/sports.jpg",
  },
  {
    id: "performances",
    label: "Performances",
    href: "/events?category=Performances",
    imageUrl: "/images/explore/events/performances.jpg",
  },
  {
    id: "food",
    label: "Food & Drinks",
    href: "/events?category=Food",
    imageUrl: "/images/explore/events/food.jpg",
  },
  {
    id: "social",
    label: "Social Mixers",
    href: "/events?category=Social",
    imageUrl: "/images/explore/events/social.jpg",
  },
  {
    id: "screenings",
    label: "Screenings",
    href: "/events?category=Screenings",
    imageUrl: "/images/explore/events/screenings.jpg",
  },
  {
    id: "fitness",
    label: "Fitness",
    href: "/events?category=Fitness",
    imageUrl: "/images/explore/events/fitness.jpg",
  },
  {
    id: "expos",
    label: "Expos",
    href: "/events?category=Expos",
    imageUrl: "/images/explore/events/expos.jpg",
  },
  {
    id: "art",
    label: "Art Exhibitions",
    href: "/events?category=Art",
    imageUrl: "/images/explore/events/art.jpg",
  },
  {
    id: "fests",
    label: "Fest & Fairs",
    href: "/events?category=Fests",
    imageUrl: "/images/explore/events/fests.jpg",
  },
  {
    id: "romantic",
    label: "Romantic",
    href: "/events?category=Romantic",
    imageUrl: "/images/explore/events/romantic.jpg",
  },
  {
    id: "chill",
    label: "Chill",
    href: "/events?category=Chill",
    imageUrl: "/images/explore/events/chill.jpg",
  },
  {
    id: "family",
    label: "Family",
    href: "/events?category=Family",
    imageUrl: "/images/explore/events/family.jpg",
  },
];
