import { hasPublicApi } from "@/config/env";
import { apiGet } from "@/lib/api/client";
import { fallbackEvents } from "@/lib/data/fallback";
import type { EventListResult, LiveEvent } from "@/types/event";

/**
 * TODO: Replace `/events` after the events API docs are provided.
 * Required env: NEXT_PUBLIC_API_BASE_URL
 */
const EVENTS_PATH = "/events";

export async function getUpcomingEvents(): Promise<EventListResult> {
  if (!hasPublicApi()) {
    return { items: fallbackEvents, source: "fallback" };
  }

  try {
    const payload = await apiGet<LiveEvent[] | { data?: LiveEvent[] }>(
      EVENTS_PATH,
      { revalidate: 120 },
    );
    const items = Array.isArray(payload) ? payload : (payload.data ?? []);
    return { items, source: "api" };
  } catch {
    return { items: fallbackEvents, source: "fallback" };
  }
}

export async function getEventById(id: string): Promise<LiveEvent | null> {
  const { items } = await getUpcomingEvents();
  return items.find((event) => event.id === id) ?? null;
}
