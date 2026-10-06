"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { SaveButton } from "@/components/common/SaveButton";
import { movieMeta } from "@/lib/format";
import { trackRecentView } from "@/lib/recent/storage";
import type { Movie } from "@/types/movie";

type SpotlightCardProps = {
  movie: Movie;
};

export function SpotlightCard({ movie }: SpotlightCardProps) {
  return (
    <article className="group relative flex min-h-[420px] snap-start flex-col justify-between overflow-hidden rounded-3xl bg-black shadow-md md:min-h-[460px]">
      <Image
        src={movie.backdropUrl || movie.posterUrl}
        alt={`${movie.title} poster`}
        fill
        className="object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 86vw, 400px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

      <div className="relative z-10 flex items-center justify-between p-4">
        {movie.statusBadge ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <span className="size-2 animate-ping rounded-full bg-accent" />
            {movie.statusBadge}
          </span>
        ) : (
          <span />
        )}
        <SaveButton
          label={`Save ${movie.title}`}
          variant="flame"
          itemId={`movie-${movie.id}`}
          title={movie.title}
          href={`/movies/${movie.id}`}
          imageUrl={movie.posterUrl}
          meta={movie.languages[0]}
          category="movies"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-1 p-4 text-white">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#FFB2BA]">
          {movie.rating ? (
            <span className="inline-flex items-center font-bold text-amber-400">
              <Star className="mr-0.5 size-4 fill-current" />
              {movie.rating.toFixed(1)}/10
            </span>
          ) : null}
          {movie.voteLabel ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{movie.voteLabel}</span>
            </>
          ) : null}
          {movie.certification ? (
            <>
              <span aria-hidden="true">•</span>
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                {movie.certification}
              </span>
            </>
          ) : null}
        </div>
        <h3 className="text-2xl leading-8 font-extrabold tracking-tight">
          {movie.title}
        </h3>
        <p className="line-clamp-1 text-xs text-white/80">
          {movie.description ||
            movieMeta(movie.genres, movie.languages, movie.duration)}
        </p>
        <div className="flex items-center gap-2 pt-2">
          <Link
            href={`/movies/${movie.id}`}
            onClick={() =>
              trackRecentView({
                id: movie.id,
                title: movie.title,
                href: `/movies/${movie.id}`,
                imageUrl: movie.posterUrl,
                meta: movie.genres.slice(0, 2).join(" · "),
                category: "movies",
              })
            }
            className="w-full rounded-full bg-accent py-2 text-center text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#E70052]"
          >
            Book Seats
          </Link>
          <button
            type="button"
            aria-label={`Play trailer for ${movie.title}`}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <Play className="size-[18px] fill-current" />
          </button>
        </div>
      </div>
    </article>
  );
}
