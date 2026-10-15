import type { MovieVideo } from "@/types/movie";

/** TMDB often has no YouTube rows for new Indian releases — pin known official trailers */
const TRAILER_OVERRIDES: Record<string, Array<{ key: string; name: string }>> = {
  // Jailer 2
  "1234139": [{ key: "FW_PPcr1sPE", name: "Official Trailer" }],
  // Mayookha
  "1620668": [{ key: "pYB9ImQYNjY", name: "Official Trailer" }],
};

/** Certifications missing from TMDB release_dates */
export const CERT_OVERRIDES: Record<string, string> = {
  "1620668": "A",
};

function toVideo(key: string, name: string): MovieVideo {
  return {
    id: key,
    key,
    name,
    type: "Trailer",
    site: "YouTube",
    thumbnailUrl: `https://i.ytimg.com/vi/${key}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${key}`,
  };
}

export function applyTrailerOverrides(
  movieId: string,
  videos: MovieVideo[],
): MovieVideo[] {
  const overrides = TRAILER_OVERRIDES[movieId];
  if (!overrides?.length) return videos;

  const seen = new Set(videos.map((v) => v.key));
  const extra = overrides
    .filter((item) => !seen.has(item.key))
    .map((item) => toVideo(item.key, item.name));

  return [...extra, ...videos];
}

export function preferTrailersFirst(videos: MovieVideo[]): MovieVideo[] {
  return [...videos].sort((a, b) => {
    const rank = (v: MovieVideo) =>
      v.type === "Trailer" ? 0 : v.type === "Teaser" ? 1 : 2;
    return rank(a) - rank(b);
  });
}
