/**
 * Server-safe environment access.
 *
 * TMDB is read from EXPO_PUBLIC_TMDB_API_KEY (or TMDB_API_KEY / MOVIES_API_KEY).
 * That value is used only on the server. Do not import this file from Client Components.
 *
 * Google Maps is read from VITE_GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 */
function readEnv(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  appUrl: readEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  publicApiBaseUrl: readEnv("NEXT_PUBLIC_API_BASE_URL"),
  moviesApiBaseUrl: readEnv(
    "MOVIES_API_BASE_URL",
    "https://api.themoviedb.org/3",
  ),
  moviesApiKey:
    readEnv("EXPO_PUBLIC_TMDB_API_KEY") ||
    readEnv("TMDB_API_KEY") ||
    readEnv("MOVIES_API_KEY"),
  imageBaseUrl: readEnv(
    "NEXT_PUBLIC_IMAGE_BASE_URL",
    "https://image.tmdb.org/t/p",
  ),
  defaultCity: readEnv("NEXT_PUBLIC_DEFAULT_CITY", "Hyderabad"),
  googleMapsApiKey:
    readEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY") ||
    readEnv("VITE_GOOGLE_MAPS_API_KEY"),
} as const;

export function hasMoviesApi(): boolean {
  return Boolean(env.moviesApiKey);
}

export function hasPublicApi(): boolean {
  return Boolean(env.publicApiBaseUrl);
}

export function hasGoogleMaps(): boolean {
  return Boolean(env.googleMapsApiKey);
}
