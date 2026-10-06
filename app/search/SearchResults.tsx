"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieGridSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import type { Movie, MovieListResult } from "@/types/movie";

type SearchResultsProps = {
  initialQuery: string;
  initialMovies: Movie[];
};

export function SearchResults({
  initialQuery,
  initialMovies,
}: SearchResultsProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState(initialMovies);
  const [loading, setLoading] = useState(false);

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");

      if (!trimmed) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/movies/search?q=${encodeURIComponent(trimmed)}`,
        );
        const payload = (await response.json()) as MovieListResult;
        setMovies(payload.items ?? []);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(handle);
  }, [router, trimmed]);

  return (
    <div>
      <label className="sr-only" htmlFor="vybe-search">
        Search movies and events
      </label>
      <input
        id="vybe-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies, events..."
        className="mb-8 h-12 w-full rounded-full border border-border bg-surface px-5 text-sm text-text outline-none focus:ring-2 focus:ring-accent/20"
      />
      {loading ? (
        <MovieGridSkeleton />
      ) : trimmed && movies.length === 0 ? (
        <EmptyState
          title="No matches yet"
          description="Try another title, or connect the movie API for live search."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
