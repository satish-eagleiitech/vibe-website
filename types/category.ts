export type CategoryId =
  | "dining"
  | "movies"
  | "events"
  | "activities"
  | "play";

export type CategoryCardData = {
  id: CategoryId;
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
  gradientFrom: string;
  gradientTo: string;
};
