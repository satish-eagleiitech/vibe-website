"use client";

import Image from "next/image";
import { Heart, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { isSaved, toggleSaved } from "@/lib/saved/storage";
import type { MovieDetails } from "@/types/movie";

type MovieDetailPosterActionsProps = {
  movie: MovieDetails;
  trailerUrl?: string;
};

function StarRow({ rating }: { rating: number }) {
  const filled = Math.round((rating / 10) * 5);
  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`size-4 ${
            index < filled
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-white/25"
          }`}
        />
      ))}
    </div>
  );
}

export function MovieDetailPosterActions({
  movie,
  trailerUrl,
}: MovieDetailPosterActionsProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(movie.id));
  }, [movie.id]);

  function onToggleFavorite() {
    const next = toggleSaved({
      id: movie.id,
      title: movie.title,
      href: `/movies/${movie.id}`,
      imageUrl: movie.posterUrl,
      meta: movie.genres.slice(0, 2).join(" · "),
      category: "movies",
    });
    setSaved(next);
  }

  return (
    <div className="mx-auto w-[200px] shrink-0 lg:mx-0 lg:w-[220px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-muted shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          className="object-cover"
          sizes="220px"
          priority
        />
        {trailerUrl ? (
          <a
            href={trailerUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-x-0 bottom-3 z-[1] mx-auto flex w-[min(86%,160px)] items-center justify-center gap-2 rounded-full bg-black/70 px-3 py-2 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-accent"
          >
            <Play className="size-3.5 fill-white" />
            Trailer
          </a>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavorite}
          className="flex-1 rounded-full border border-border bg-surface px-3 py-2.5 text-[12px] font-bold text-text"
        >
          {saved ? "Saved" : "Add to favorites"}
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border ${
            saved
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-surface text-text"
          }`}
        >
          <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      {movie.rating ? <StarRow rating={movie.rating} /> : null}
    </div>
  );
}
