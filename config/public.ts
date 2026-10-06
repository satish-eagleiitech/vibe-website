/**
 * Values that are safe to import from Client Components.
 * Never put the TMDB key here.
 */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  defaultCity: process.env.NEXT_PUBLIC_DEFAULT_CITY ?? "Hyderabad",
  googleMapsApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.VITE_GOOGLE_MAPS_API_KEY ??
    "",
  imageBaseUrl:
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p",
} as const;
