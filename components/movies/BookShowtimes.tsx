"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import {
  getBookingDates,
  getMovieTheatres,
} from "@/lib/data/booking";
import type { MovieDetails } from "@/types/movie";

type BookShowtimesProps = {
  movie: MovieDetails;
};

const filters = [
  "Morning",
  "After 5 PM",
  "Recliners",
  "Wheelchair Friendly",
  "Premium Seats",
] as const;

export function BookShowtimes({ movie }: BookShowtimesProps) {
  const router = useRouter();
  const dates = useMemo(() => getBookingDates(7), []);
  const [dateIso, setDateIso] = useState(dates[0]?.iso ?? "");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const theatres = useMemo(
    () => getMovieTheatres(movie.id, dateIso),
    [movie.id, dateIso],
  );

  const monthLabel = dates[0]?.month ?? "";

  return (
    <div className="w-full pb-16">
      <section className="border-b border-border bg-surface">
        <Container className="flex items-center gap-4 py-5 md:gap-5 md:py-6">
          <div className="relative aspect-[2/3] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-muted md:w-[88px]">
            <Image
              src={movie.posterUrl}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-extrabold text-text md:text-[28px]">
              {movie.title}
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary md:text-[14px]">
              {[movie.certification, movie.duration]
                .filter(Boolean)
                .join(" | ")}
              {movie.languages.length
                ? ` · ${movie.languages
                    .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
                    .join(", ")}`
                : ""}
            </p>
            <p className="mt-1 text-[13px] text-text-muted">
              {movie.genres.slice(0, 3).join(", ")}
            </p>
          </div>
        </Container>
      </section>

      <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-stretch gap-3 overflow-x-auto hide-scrollbar">
            <div className="flex w-10 shrink-0 items-center justify-center text-[12px] font-extrabold tracking-widest text-text-secondary [writing-mode:vertical-rl] rotate-180">
              {monthLabel}
            </div>
            {dates.map((date) => {
              const active = date.iso === dateIso;
              return (
                <button
                  key={date.iso}
                  type="button"
                  onClick={() => setDateIso(date.iso)}
                  className={`flex h-[64px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface text-text hover:border-accent/40"
                  }`}
                >
                  <span className="text-[18px] font-extrabold leading-none">
                    {date.day}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold">
                    {date.weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="pt-4">
        <div className="mb-4 rounded-xl bg-accent-soft px-4 py-3 text-[13px] font-semibold text-accent">
          Bookings open for shows today and the week ahead in Hyderabad.
        </div>

        <div className="hide-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-text">
            Filters
          </span>
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(active ? null : filter)
                }
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-text-secondary"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-4 text-[12px] font-semibold text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-400" /> Filling fast
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500" /> Almost full
          </span>
        </div>

        <div className="space-y-4">
          {theatres.map((theatre) => (
            <article
              key={theatre.id}
              className="rounded-2xl border border-border bg-surface p-4 md:p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[12px] font-extrabold text-text">
                    {theatre.brand ?? theatre.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-text md:text-[17px]">
                      {theatre.name}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {theatre.distanceKm} km · {theatre.area}
                      </span>
                      <span>
                        {theatre.cancellable
                          ? "Allows cancellation"
                          : "Non-cancellable"}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Save theatre"
                  className="inline-flex size-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-muted hover:text-accent"
                >
                  <Heart className="size-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(theatre.showtimes ?? []).map((show) => {
                  const tone =
                    show.status === "almost"
                      ? "border-rose-400/50 text-rose-400"
                      : show.status === "filling"
                        ? "border-amber-400/50 text-amber-500"
                        : "border-emerald-500/40 text-emerald-500";
                  return (
                    <button
                      key={show.id}
                      type="button"
                      onClick={() =>
                        router.push(
                          `/movies/${movie.id}/seats?theatre=${theatre.id}&show=${show.id}&date=${dateIso}`,
                        )
                      }
                      className={`min-w-[92px] rounded-xl border bg-bg px-3 py-2.5 text-center transition-transform hover:scale-[1.02] ${tone}`}
                    >
                      <span className="block text-[14px] font-extrabold text-text">
                        {show.label}
                      </span>
                      <span className="block text-[11px] font-semibold opacity-80">
                        {show.format}
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/movies/${movie.id}`}
            className="text-sm font-semibold text-text-secondary hover:text-accent"
          >
            Back to movie details
          </Link>
        </div>
      </Container>
    </div>
  );
}
