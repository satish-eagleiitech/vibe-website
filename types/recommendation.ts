export type Recommendation = {
  id: string;
  eyebrow: string;
  title: string;
  meta: string;
  href: string;
  cta: string;
  imageUrl: string;
  tone?: "accent" | "teal" | "dining";
};
