export type Activity = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  venue?: string;
  schedule?: string;
  price: number;
  priceUnit: string;
};

export type ActivityListResult = {
  items: Activity[];
  source: "api" | "fallback";
};
