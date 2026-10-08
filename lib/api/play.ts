import { hasPublicApi } from "@/config/env";
import { apiGet } from "@/lib/api/client";
import { fallbackPlay } from "@/lib/data/fallback";
import { findGeneratedPlayVenue, generatedPlayVenues } from "@/lib/data/playGenerated";
import { isPlayEvent, isPlayVenue, matchesPlaySport } from "@/lib/data/playSports";
import type { PlayItem, PlayListResult } from "@/types/play";

/**
 * TODO: Replace `/play` after a play/venues API is provided.
 * Required env: NEXT_PUBLIC_API_BASE_URL
 */
const PLAY_PATH = "/play";

const DEFAULT_SLOTS = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

function enrichItem(item: PlayItem): PlayItem {
  const kind = item.kind ?? "venue";
  return {
    ...item,
    kind,
    sport: item.sport ?? "Play",
    locality: item.locality ?? item.venue,
    distanceKm: kind === "event" ? item.distanceKm : (item.distanceKm ?? 2.4),
    hours: item.hours ?? "6:00 AM to 11:00 PM",
    rating: item.rating ?? 4.4,
    amenities: item.amenities ?? ["Parking", "Changing rooms", "Floodlights"],
    slots: item.slots ?? DEFAULT_SLOTS,
  };
}

export async function getPlayItems(): Promise<PlayListResult> {
  if (!hasPublicApi()) {
    return { items: fallbackPlay.map(enrichItem), source: "fallback" };
  }

  try {
    const payload = await apiGet<PlayItem[] | { data?: PlayItem[] }>(PLAY_PATH, {
      revalidate: 120,
    });
    const items = Array.isArray(payload) ? payload : (payload.data ?? []);
    const list = items.length ? items : fallbackPlay;
    return { items: list.map(enrichItem), source: items.length ? "api" : "fallback" };
  } catch {
    return { items: fallbackPlay.map(enrichItem), source: "fallback" };
  }
}

export async function getPlayById(id: string): Promise<PlayItem | null> {
  const { items } = await getPlayItems();
  const found = items.find((item) => item.id === id);
  if (found) return found;
  const generated = findGeneratedPlayVenue(id);
  return generated ? enrichItem(generated) : null;
}

export async function getPlayVenues(): Promise<PlayItem[]> {
  const { items } = await getPlayItems();
  return items.filter(isPlayVenue);
}

export async function getPlaySportVenues(sportId: string): Promise<PlayItem[]> {
  const venues = (await getPlayVenues()).filter((venue) => matchesPlaySport(venue, sportId));
  return [...venues, ...generatedPlayVenues(sportId, venues.length).map(enrichItem)];
}

export async function getPlayEvents(): Promise<PlayItem[]> {
  const { items } = await getPlayItems();
  return items.filter(isPlayEvent);
}
