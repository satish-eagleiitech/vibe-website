import { hasMoviesApi } from "@/config/env";
import { apiGet, resolveTmdbImage } from "@/lib/api/client";
import { landingArtists } from "@/lib/data/landingExtras";
import type { LandingArtist } from "@/lib/data/landingExtras";
import type { TmdbPagedResponse } from "@/types/tmdb";

type TmdbPersonResult = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
};

/** Featured Indian acts — resolved via TMDB person photos when available */
const FEATURED_QUERIES: Array<{
  id: string;
  name: string;
  query: string;
  tone: string;
}> = [
  { id: "artist-arijit", name: "Arijit Singh", query: "Arijit Singh", tone: "#ff005b" },
  { id: "artist-shreya", name: "Shreya Ghoshal", query: "Shreya Ghoshal", tone: "#111827" },
  { id: "artist-diljit", name: "Diljit Dosanjh", query: "Diljit Dosanjh", tone: "#e11d48" },
  { id: "artist-sunidhi", name: "Sunidhi Chauhan", query: "Sunidhi Chauhan", tone: "#9f1239" },
  { id: "artist-anirudh", name: "Anirudh Ravichander", query: "Anirudh Ravichander", tone: "#fb7185" },
  { id: "artist-kailash", name: "Kailash Kher", query: "Kailash Kher", tone: "#be185d" },
  { id: "artist-neha", name: "Neha Kakkar", query: "Neha Kakkar", tone: "#ff005b" },
  { id: "artist-prateek", name: "Prateek Kuhad", query: "Prateek Kuhad", tone: "#1e1e26" },
];

async function searchPerson(query: string): Promise<TmdbPersonResult | null> {
  const payload = await apiGet<TmdbPagedResponse<TmdbPersonResult>>(
    "/search/person",
    {
      movies: true,
      query: {
        query,
        include_adult: "false",
        language: "en-IN",
      },
      revalidate: 60 * 60 * 12,
    },
  );

  const withPhoto = payload.results.find((person) => person.profile_path);
  return withPhoto ?? payload.results[0] ?? null;
}

export async function getFeaturedArtists(): Promise<LandingArtist[]> {
  if (!hasMoviesApi()) {
    return landingArtists;
  }

  try {
    const results = await Promise.all(
      FEATURED_QUERIES.map(async (item) => {
        try {
          const person = await searchPerson(item.query);
          const imageUrl = person?.profile_path
            ? resolveTmdbImage(person.profile_path, "w500")
            : "";
          if (!imageUrl) {
            return landingArtists.find((a) => a.id === item.id) ?? {
              id: item.id,
              name: item.name,
              imageUrl: "/images/artists/artist-1.jpg",
              href: "/events",
              tone: item.tone,
            };
          }
          const fallbackMeta = landingArtists.find((a) => a.id === item.id);
          return {
            id: item.id,
            name: item.name,
            imageUrl,
            href: "/events",
            tone: item.tone,
            tag: fallbackMeta?.tag,
            viewsLabel: fallbackMeta?.viewsLabel,
          } satisfies LandingArtist;
        } catch {
          return (
            landingArtists.find((a) => a.id === item.id) ?? {
              id: item.id,
              name: item.name,
              imageUrl: "/images/artists/artist-1.jpg",
              href: "/events",
              tone: item.tone,
            }
          );
        }
      }),
    );

    return results;
  } catch {
    return landingArtists;
  }
}
