import { hasPublicApi } from "@/config/env";
import { apiGet } from "@/lib/api/client";
import { fallbackDining } from "@/lib/data/fallback";
import type { DiningListResult, DiningSpot } from "@/types/dining";

/**
 * TODO: Replace `/dining` after the dining API docs are provided.
 * Required env: NEXT_PUBLIC_API_BASE_URL
 */
const DINING_PATH = "/dining";

const LOCALITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Jubilee Hills": { lat: 17.4308, lng: 78.407 },
  "Banjara Hills": { lat: 17.4138, lng: 78.4398 },
  "Financial District": { lat: 17.418, lng: 78.344 },
  "Old City": { lat: 17.3616, lng: 78.4747 },
  Madhapur: { lat: 17.4483, lng: 78.3915 },
  Gachibowli: { lat: 17.4401, lng: 78.3489 },
  "Hitech City": { lat: 17.4435, lng: 78.3772 },
  Kondapur: { lat: 17.4698, lng: 78.3578 },
  "Film Nagar": { lat: 17.416, lng: 78.41 },
  Secunderabad: { lat: 17.4399, lng: 78.4983 },
  Begumpet: { lat: 17.4447, lng: 78.4664 },
};

const DEFAULT_FACILITIES = [
  "Lunch",
  "Dinner",
  "Indoor seating",
  "Valet parking",
  "Air conditioning",
  "Family friendly",
  "Takeaway available",
  "Wheelchair access",
];

function reviewCountFrom(label?: string) {
  if (!label) return 240;
  const compact = label.replace(/[+,]/g, "").toUpperCase();
  if (compact.endsWith("K")) {
    return Math.round(Number.parseFloat(compact) * 1000);
  }
  return Number.parseInt(compact, 10) || 240;
}

function enrichSpot(spot: DiningSpot, galleryPool: string[]): DiningSpot {
  const extras = galleryPool.filter((url) => url !== spot.imageUrl).slice(0, 5);
  const coords = LOCALITY_COORDS[spot.locality] ?? {
    lat: 17.385,
    lng: 78.4867,
  };

  return {
    ...spot,
    address:
      spot.address ?? `${spot.locality}, Hyderabad, Telangana`,
    costForTwo:
      spot.costForTwo ?? (spot.priceRange === "₹₹₹" ? 2000 : 1200),
    hours: spot.hours ?? "12:00 PM to 11:00 PM",
    phone: spot.phone ?? "+91 40 4567 8900",
    gallery: spot.gallery ?? [spot.imageUrl, ...extras],
    facilities: spot.facilities ?? DEFAULT_FACILITIES,
    reviewCount: spot.reviewCount ?? reviewCountFrom(spot.reviewLabel),
    scores: spot.scores ?? {
      ambience: Math.min(5, Number((spot.rating + 0.2).toFixed(1))),
      food: spot.rating,
      service: Math.max(3.8, Number((spot.rating - 0.1).toFixed(1))),
    },
    menuImageUrl: spot.menuImageUrl ?? spot.imageUrl,
    lat: spot.lat ?? coords.lat,
    lng: spot.lng ?? coords.lng,
  };
}

export async function getDiningSpots(): Promise<DiningListResult> {
  if (!hasPublicApi()) {
    return { items: fallbackDining, source: "fallback" };
  }

  try {
    const payload = await apiGet<DiningSpot[] | { data?: DiningSpot[] }>(
      DINING_PATH,
      { revalidate: 120 },
    );
    const items = Array.isArray(payload) ? payload : (payload.data ?? []);
    return { items, source: "api" };
  } catch {
    return { items: fallbackDining, source: "fallback" };
  }
}

export async function getDiningById(id: string): Promise<DiningSpot | null> {
  const { items } = await getDiningSpots();
  const spot = items.find((item) => item.id === id);
  if (!spot) return null;
  return enrichSpot(
    spot,
    items.map((item) => item.imageUrl),
  );
}
