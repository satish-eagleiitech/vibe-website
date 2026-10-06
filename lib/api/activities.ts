import { hasPublicApi } from "@/config/env";
import { apiGet } from "@/lib/api/client";
import { fallbackActivities } from "@/lib/data/fallback";
import type { Activity, ActivityListResult } from "@/types/activity";

/**
 * TODO: Replace `/activities` after the activities API docs are provided.
 * Required env: NEXT_PUBLIC_API_BASE_URL
 */
const ACTIVITIES_PATH = "/activities";

export async function getActivities(): Promise<ActivityListResult> {
  if (!hasPublicApi()) {
    return { items: fallbackActivities, source: "fallback" };
  }

  try {
    const payload = await apiGet<Activity[] | { data?: Activity[] }>(
      ACTIVITIES_PATH,
      { revalidate: 120 },
    );
    const items = Array.isArray(payload) ? payload : (payload.data ?? []);
    return { items, source: "api" };
  } catch {
    return { items: fallbackActivities, source: "fallback" };
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const { items } = await getActivities();
  return items.find((activity) => activity.id === id) ?? null;
}
