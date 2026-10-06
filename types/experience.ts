export type Experience = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: number;
};

export type ExperienceListResult = {
  items: Experience[];
  source: "api" | "fallback";
};
