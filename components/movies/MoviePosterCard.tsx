"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { trackRecentView } from "@/lib/recent/storage";
import type { Movie } from "@/types/movie";

type MoviePosterCardProps = {
  movie: Movie;
  priority?: boolean;
};

export function MoviePosterCard({ movie, priority }: MoviePosterCardProps) {
  const year = movie.releaseDate?.slice(0, 4);
  const meta = [year, movie.genres[0]].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/movies/${movie.id}`}
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
      className="group flex w-full flex-col"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-muted shadow-[0_8px_22px_rgba(17,24,39,0.12)] ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-1 dark:shadow-[0_10px_26px_rgba(0,0,0,0.5)] dark:ring-white/5">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
          <span className="inline-flex size-12 scale-75 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-[0_8px_20px_rgba(255,0,91,0.45)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Play className="size-5 fill-current" />
          </span>
        </div>
        {movie.rating ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {movie.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-[14px] leading-5 font-bold text-text transition-colors group-hover:text-accent">
        {movie.title}
      </h3>
      {meta ? (
        <p className="mt-0.5 text-[12px] text-text-muted">{meta}</p>
      ) : null}
    </Link>
  );
}
