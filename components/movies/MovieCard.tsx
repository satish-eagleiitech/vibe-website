"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import { trackRecentView } from "@/lib/recent/storage";

type MovieCardProps = {
  movie: Movie;
};

function languageLabel(languages: string[]): string {
  if (!languages.length) return "";
  const first = languages[0].charAt(0).toUpperCase() + languages[0].slice(1);
  if (languages.length === 1) return first;
  return `${first} and ${languages.length - 1} more`;
}

export function MovieCard({ movie }: MovieCardProps) {
  const meta = [movie.certification, languageLabel(movie.languages)]
    .filter(Boolean)
    .join(" | ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      onClick={() =>
        trackRecentView({
          id: movie.id,
          title: movie.title,
          href: `/movies/${movie.id}`,
          imageUrl: movie.posterUrl,
          meta: meta || movie.genres.slice(0, 2).join(", "),
          category: "movies",
        })
      }
      className="group flex w-full flex-col rounded-[16px] bg-transparent transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[16px] bg-surface-muted">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 45vw, 180px"
        />
      </div>
      <div className="pt-3 pb-1">
        <h3 className="truncate text-[15px] leading-5 font-extrabold text-text">
          {movie.title}
        </h3>
        <p className="mt-1 truncate text-[12px] leading-4 text-text-secondary">
          {meta || movie.genres.slice(0, 2).join(", ")}
        </p>
      </div>
    </Link>
  );
}
