import type { DiningMood, DiningSpot } from "@/types/dining";

export const diningMoods: DiningMood[] = [
  {
    id: "north-indian",
    label: "North Indian",
    imageUrl: "/images/dining/dining-10.jpg",
    tone: "#111827",
    href: "/dining?mood=north-indian",
    match: "north|tandoor|hyderabadi|biryani",
  },
  {
    id: "chinese",
    label: "Chinese",
    imageUrl: "/images/dining/dining-12.jpg",
    tone: "#9f1239",
    href: "/dining?mood=chinese",
    match: "chinese|asian|pan-asian",
  },
  {
    id: "cafe",
    label: "Cafe",
    imageUrl: "/images/dining/dining-2.jpg",
    tone: "#ff005b",
    href: "/dining?mood=cafe",
    match: "coffee|cafe|bakery|brunch",
  },
  {
    id: "european",
    label: "European",
    imageUrl: "/images/dining/dining-1.jpg",
    tone: "#e11d48",
    href: "/dining?mood=european",
    match: "mediterranean|european|continental|pasta|italian",
  },
  {
    id: "grill",
    label: "Grill",
    imageUrl: "/images/dining/dining-6.jpg",
    tone: "#be185d",
    href: "/dining?mood=grill",
    match: "grill|steak|bbq|kebab",
  },
  {
    id: "buffet",
    label: "Buffet",
    imageUrl: "/images/dining/spot-grand-buffet.jpg",
    tone: "#fb7185",
    href: "/dining?mood=buffet",
    match: "buffet",
  },
  {
    id: "casual",
    label: "Casual",
    imageUrl: "/images/dining/dining-7.jpg",
    tone: "#111827",
    href: "/dining?mood=casual",
    match: "burger|street|american|casual|bistro|bowls",
  },
  {
    id: "nightlife",
    label: "Nightlife",
    imageUrl: "/images/dining/dining-3.jpg",
    tone: "#9f1239",
    href: "/dining?mood=nightlife",
    match: "brew|cocktail|night|bar",
  },
];

export function matchesDiningMood(spot: DiningSpot, moodId?: string) {
  if (!moodId) return true;
  const mood = diningMoods.find((item) => item.id === moodId);
  if (!mood) return true;
  const hay = `${spot.cuisine} ${spot.name} ${spot.tags.join(" ")}`.toLowerCase();
  return new RegExp(mood.match, "i").test(hay);
}
