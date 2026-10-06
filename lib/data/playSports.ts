import type { PlayItem, PlaySport } from "@/types/play";

export const playSports: PlaySport[] = [
  {
    id: "badminton",
    label: "Badminton",
    href: "/play?sport=badminton#all-venues",
    imageUrl: "/images/explore/play/badminton.png",
  },
  {
    id: "swimming",
    label: "Swimming",
    href: "/play?sport=swimming#all-venues",
    imageUrl: "/images/explore/play/swimming.png",
  },
  {
    id: "pickleball",
    label: "Pickleball",
    href: "/play?sport=pickleball#all-venues",
    imageUrl: "/images/explore/play/pickleball.png",
  },
  {
    id: "turf-football",
    label: "Turf Football",
    href: "/play?sport=turf-football#all-venues",
    imageUrl: "/images/explore/play/turf-football.png",
  },
  {
    id: "table-tennis",
    label: "Table Tennis",
    href: "/play?sport=table-tennis#all-venues",
    imageUrl: "/images/explore/play/table-tennis.png",
  },
  {
    id: "box-cricket",
    label: "Box Cricket",
    href: "/play?sport=box-cricket#all-venues",
    imageUrl: "/images/explore/play/box-cricket.png",
  },
  {
    id: "padel",
    label: "Padel",
    href: "/play?sport=padel#all-venues",
    imageUrl: "/images/explore/play/padel.png",
  },
  {
    id: "cricket-nets",
    label: "Cricket Nets",
    href: "/play?sport=cricket-nets#all-venues",
    imageUrl: "/images/explore/play/cricket-nets.png",
  },
  {
    id: "tennis",
    label: "Tennis",
    href: "/play?sport=tennis#all-venues",
    imageUrl: "/images/explore/play/tennis.png",
  },
  {
    id: "basketball",
    label: "Basketball",
    href: "/play?sport=basketball#all-venues",
    imageUrl: "/images/explore/play/basketball.png",
  },
  {
    id: "snooker",
    label: "Snooker",
    href: "/play?sport=snooker#all-venues",
    imageUrl: "/images/explore/play/snooker.png",
  },
  {
    id: "pool",
    label: "Pool",
    href: "/play?sport=pool#all-venues",
    imageUrl: "/images/explore/play/pool.png",
  },
  {
    id: "volleyball",
    label: "Volleyball",
    href: "/play?sport=volleyball#all-venues",
    imageUrl: "/images/explore/play/volleyball.png",
  },
  {
    id: "football",
    label: "Football",
    href: "/play?sport=football#all-venues",
    imageUrl: "/images/explore/play/football.png",
  },
  {
    id: "cricket",
    label: "Cricket",
    href: "/play?sport=cricket#all-venues",
    imageUrl: "/images/explore/play/cricket.png",
  },
];

export function matchesPlaySport(item: PlayItem, sportId?: string) {
  if (!sportId) return true;
  const sport = playSports.find((entry) => entry.id === sportId);
  const hay = `${item.sport ?? ""} ${item.title} ${item.description}`.toLowerCase();
  if (sport) return hay.includes(sport.label.toLowerCase()) || hay.includes(sportId.replace("-", " "));
  return hay.includes(sportId.toLowerCase());
}

export function isPlayEvent(item: PlayItem) {
  return item.kind === "event";
}

export function isPlayVenue(item: PlayItem) {
  return item.kind !== "event";
}
