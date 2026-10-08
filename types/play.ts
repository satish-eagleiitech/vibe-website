export type PlayKind = "venue" | "event";

export type PlayItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  venue: string;
  schedule: string;
  price?: number;
  priceUnit?: string;
  sport?: string;
  /** Every sport the venue offers; `sport` stays the primary one */
  sports?: string[];
  locality?: string;
  distanceKm?: number;
  kind?: PlayKind;
  dateLabel?: string;
  timeLabel?: string;
  amenities?: string[];
  slots?: string[];
  hours?: string;
  rating?: number;
};

export type PlayListResult = {
  items: PlayItem[];
  source: "api" | "fallback";
};

export type PlaySport = {
  id: string;
  label: string;
  href: string;
  imageUrl: string;
  /** Heading on the sport listing page, e.g. "Box Cricket Turfs" */
  listingTitle: string;
};
