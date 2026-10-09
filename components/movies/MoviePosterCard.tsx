"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { trackRecentView } from "@/lib/recent/storage";
import type { Movie } from "@/types/movie";

type MoviePosterCardProps = {
  movie: Movie;
  priority?: boolean;
};

function languageLine(languages: string[]) {
  const names = [...new Set(languages.filter(Boolean))].map(
    (lang) => lang.charAt(0).toUpperCase() + lang.slice(1),
  );
  if (!names.length) return null;
  if (names.length === 1) return names[0];
  return `${names[0]} and ${names.length - 1} more`;
}

export function MoviePosterCard({ movie, priority }: MoviePosterCardProps) {
  const meta = [movie.certification ?? movie.genres[0], languageLine(movie.languages)]
    .filter(Boolean)
    .join(" | ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      data-stand-card
      onClick={() =>
        trackRecentView({
          id: movie.id,
          title: movie.title,
          href: `/movies/${movie.id}`,
          imageUrl: movie.posterUrl,
          meta: movie.genres.slice(0, 2).join(", "),
          category: "movies",
        })
      }
      className="group flex w-full flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_8px_24px_rgba(87,82,79,0.08)] ring-1 ring-black/[0.03] will-change-transform dark:shadow-[0_10px_26px_rgba(0,0,0,0.5)] dark:ring-white/5"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-muted">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
        />
        {movie.rating ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {movie.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="px-3 pt-3 pb-3.5">
        <h3 className="line-clamp-2 text-[14.5px] leading-[1.25] font-semibold tracking-[-0.02em] text-text transition-colors group-hover:text-accent">
          {movie.title}
        </h3>
        {meta ? (
          <p className="mt-1 text-[12px] leading-[1.3] font-medium text-text-muted">{meta}</p>
        ) : null}
      </div>
    </Link>
  );
}
