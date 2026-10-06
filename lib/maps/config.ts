import { publicEnv } from "@/config/public";

/**
 * Google Maps browser key.
 * Restrict this key by HTTP referrer in Google Cloud Console.
 */
export function getGoogleMapsBrowserKey(): string {
  return publicEnv.googleMapsApiKey;
}

export function hasGoogleMapsBrowserKey(): boolean {
  return Boolean(publicEnv.googleMapsApiKey);
}
