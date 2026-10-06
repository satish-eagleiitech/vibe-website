import { env } from "@/config/env";

type RequestOptions = {
  query?: Record<string, string | undefined>;
  headers?: HeadersInit;
  cache?: RequestCache;
  revalidate?: number;
  /**
   * Use the server-only TMDB movie API.
   * Never call this from a Client Component.
   */
  movies?: boolean;
};

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | undefined>,
): string {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

function redactUrl(url: string): string {
  return url.replace(/api_key=[^&]+/g, "api_key=REDACTED");
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Shared fetch helper.
 *
 * TMDB v3 uses `api_key` as a query param (not a browser-exposed NEXT_PUBLIC key).
 * Public APIs use NEXT_PUBLIC_API_BASE_URL when those endpoints exist.
 */
export async function apiGet<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = options.movies ? env.moviesApiBaseUrl : env.publicApiBaseUrl;

  if (!baseUrl) {
    throw new ApiError(
      options.movies
        ? "MOVIES_API_BASE_URL is not configured. Add it to .env.local."
        : "NEXT_PUBLIC_API_BASE_URL is not configured. Add it to .env.local.",
    );
  }

  const query = { ...options.query };

  if (options.movies) {
    if (!env.moviesApiKey) {
      throw new ApiError(
        "EXPO_PUBLIC_TMDB_API_KEY is not configured. Add it to .env.local.",
      );
    }
    query.api_key = env.moviesApiKey;
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const url = buildUrl(baseUrl, path, query);
  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: options.cache ?? "force-cache",
    next: { revalidate: options.revalidate ?? 60 },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed with ${response.status}`,
      response.status,
      redactUrl(url),
    );
  }

  return (await response.json()) as T;
}

export function resolveTmdbImage(
  path?: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "w1280" | "original" = "w500",
): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = env.imageBaseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${size}${normalized}`;
}

export function resolveImageUrl(path?: string): string {
  return resolveTmdbImage(path);
}
