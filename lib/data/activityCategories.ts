export type ActivityExploreCategory = {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
};

/** District-style explore chips for /activities */
export const activityExploreCategories: ActivityExploreCategory[] = [
  {
    id: "game-zones",
    label: "Game Zones",
    href: "/activities?category=Indoor#all-activities",
    imageUrl: "/images/explore/activities/game-zones.png",
  },
  {
    id: "theme-parks",
    label: "Theme Parks",
    href: "/activities?category=Theme%20Parks#all-activities",
    imageUrl: "/images/explore/activities/theme-parks.png",
  },
  {
    id: "monuments",
    label: "Monuments",
    href: "/activities?category=Monuments#all-activities",
    imageUrl: "/images/explore/activities/monuments.png",
  },
  {
    id: "water-parks",
    label: "Water Parks",
    href: "/activities?category=Water%20Parks#all-activities",
    imageUrl: "/images/explore/activities/water-parks.png",
  },
  {
    id: "kids-play",
    label: "Kids Play",
    href: "/activities?category=Kids#all-activities",
    imageUrl: "/images/explore/activities/kids-play.png",
  },
  {
    id: "workshops",
    label: "Workshops",
    href: "/activities?category=Workshop#all-activities",
    imageUrl: "/images/explore/activities/workshops.png",
  },
  {
    id: "adventures",
    label: "Adventures",
    href: "/activities?category=Adventure#all-activities",
    imageUrl: "/images/explore/activities/adventures.png",
  },
  {
    id: "fitness",
    label: "Fitness",
    href: "/activities?category=Fitness#all-activities",
    imageUrl: "/images/explore/activities/fitness.png",
  },
];
