export type DiningSpot = {
  id: string;
  name: string;
  imageUrl: string;
  offer?: string;
  rating: number;
  reviewLabel?: string;
  priceRange: string;
  cuisine: string;
  locality: string;
  tags: string[];
  address?: string;
  costForTwo?: number;
  hours?: string;
  phone?: string;
  gallery?: string[];
  facilities?: string[];
  reviewCount?: number;
  scores?: {
    ambience: number;
    food: number;
    service: number;
  };
  menuImageUrl?: string;
  lat?: number;
  lng?: number;
};

export type DiningListResult = {
  items: DiningSpot[];
  source: "api" | "fallback";
};

export type DiningMood = {
  id: string;
  label: string;
  imageUrl: string;
  tone: string;
  href: string;
  match: string;
};
