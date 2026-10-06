export type LiveEvent = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  venue: string;
  city?: string;
  month: string;
  day: string;
  startingPrice: number;
  currency?: string;
};

export type EventListResult = {
  items: LiveEvent[];
  source: "api" | "fallback";
};
