export type HeroSlideCategory =
  | "movies"
  | "play"
  | "activities"
  | "events";

export type HeroBannerData = {
  id: string;
  category: HeroSlideCategory;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  venue: string;
  dateLabel: string;
  statusBadge: string;
  locationBadge: string;
  ctaLabel: string;
  href: string;
};
