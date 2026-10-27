import type { PlayItem, PlaySport } from "@/types/play";

/** Studio shots with the white backdrop removed so they sit on dark cards. */
const onDark = new Set([
  "badminton",
  "swimming",
  "pickleball",
  "table-tennis",
  "padel",
  "tennis",
  "basketball",
  "snooker",
  "volleyball",
  "cricket",
]);

function sport(
  id: string,
  label: string,
  listingTitle: string,
): PlaySport {
  return {
    id,
    label,
    listingTitle,
    href: `/play/sports/${id}`,
    imageUrl: onDark.has(id)
      ? `/images/explore/play/on-dark/${id}.png`
      : `/images/explore/play/${id}.jpg`,
  };
}

export const playSports: PlaySport[] = [
  sport("badminton", "Badminton", "Badminton Courts"),
  sport("swimming", "Swimming", "Swimming Pools"),
  sport("pickleball", "Pickleball", "Pickleball Courts"),
  sport("turf-football", "Turf Football", "Football Turfs"),
  sport("table-tennis", "Table Tennis", "Table Tennis Venues"),
  sport("box-cricket", "Box Cricket", "Box Cricket Turfs"),
  sport("padel", "Padel", "Padel Courts"),
  sport("cricket-nets", "Cricket Nets", "Cricket Nets"),
  sport("tennis", "Tennis", "Tennis Courts"),
  sport("basketball", "Basketball", "Basketball Courts"),
  sport("snooker", "Snooker", "Snooker Parlours"),
  sport("volleyball", "Volleyball", "Volleyball Courts"),
  sport("football", "Football", "Football Grounds"),
  sport("cricket", "Cricket", "Cricket Grounds"),
];

export function findPlaySport(sportId: string) {
  return playSports.find((entry) => entry.id === sportId) ?? null;
}

export function playItemSports(item: PlayItem): string[] {
  if (item.sports?.length) return item.sports;
  return item.sport ? [item.sport] : [];
}

/** Venue tag match first; falls back to text search for items without tags */
export function matchesPlaySport(item: PlayItem, sportId?: string) {
  if (!sportId) return true;
  const entry = findPlaySport(sportId);
  const label = (entry?.label ?? sportId.replace(/-/g, " ")).toLowerCase();

  if (item.sports?.length) {
    return item.sports.some((tag) => tag.toLowerCase() === label);
  }

  const hay = `${item.sport ?? ""} ${item.title} ${item.description}`.toLowerCase();
  return hay.includes(label);
}

export function isPlayEvent(item: PlayItem) {
  return item.kind === "event";
}

export function isPlayVenue(item: PlayItem) {
  return item.kind !== "event";
}
