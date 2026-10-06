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
    imageUrl: "/images/explore/music.png",
  },
  {
    id: "nightlife",
    label: "Nightlife",
    href: "/events?category=Nightlife",
    imageUrl: "/images/explore/nightlife.png",
  },
  {
    id: "comedy",
    label: "Comedy",
    href: "/events?category=Comedy",
    imageUrl: "/images/explore/comedy.png",
  },
  {
    id: "sports",
    label: "Sports",
    href: "/events?category=Sports",
    imageUrl: "/images/explore/sports.png",
  },
  {
    id: "performances",
    label: "Performances",
    href: "/events?category=Performances",
    imageUrl: "/images/explore/performances.png",
  },
  {
    id: "food",
    label: "Food & Drinks",
    href: "/events?category=Food",
    imageUrl: "/images/explore/food.png",
  },
  {
    id: "social",
    label: "Social Mixers",
    href: "/events?category=Social",
    imageUrl: "/images/explore/social.png",
  },
  {
    id: "screenings",
    label: "Screenings",
    href: "/events?category=Screenings",
    imageUrl: "/images/explore/screenings.png",
  },
  {
    id: "fitness",
    label: "Fitness",
    href: "/events?category=Fitness",
    imageUrl: "/images/explore/fitness.png",
  },
  {
    id: "expos",
    label: "Expos",
    href: "/events?category=Expos",
    imageUrl: "/images/explore/expos.png",
  },
  {
    id: "art",
    label: "Art Exhibitions",
    href: "/events?category=Art",
    imageUrl: "/images/explore/art.png",
  },
  {
    id: "fests",
    label: "Fest & Fairs",
    href: "/events?category=Fests",
    imageUrl: "/images/explore/fests.png",
  },
  {
    id: "romantic",
    label: "Romantic",
    href: "/events?category=Romantic",
    imageUrl: "/images/explore/romantic.png",
  },
  {
    id: "chill",
    label: "Chill",
    href: "/events?category=Chill",
    imageUrl: "/images/explore/chill.png",
  },
  {
    id: "family",
    label: "Family",
    href: "/events?category=Family",
    imageUrl: "/images/explore/family.png",
  },
];
