"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import {
  buildSeatMap,
  findShowtime,
  getBookingDates,
  getMovieTheatres,
  type SeatCell,
} from "@/lib/data/booking";
import { formatInr } from "@/lib/format";
import type { MovieDetails } from "@/types/movie";

type SeatPickerProps = {
  movie: MovieDetails;
  theatreId: string;
  showId: string;
  dateIso: string;
};

function longDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function clock(startsAt?: string, fallback?: string) {
  if (!startsAt) return fallback ?? "";
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return fallback ?? "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SeatPicker({
  movie,
  theatreId,
  showId,
  dateIso,
}: SeatPickerProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();
  const { theatre, show } = findShowtime(movie.id, theatreId, showId, dateIso);
  const dates = useMemo(() => getBookingDates(7), []);
  const dayShows = useMemo(() => {
    return (
      getMovieTheatres(movie.id, dateIso).find((item) => item.id === theatreId)
        ?.showtimes ?? []
    );
  }, [movie.id, dateIso, theatreId]);
  const map = useMemo(() => buildSeatMap(showId), [showId]);
  const [selected, setSelected] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);

  useEffect(() => {
    setSelected([]);
  }, [showId, dateIso]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedSeats = map.seats.filter((seat) => selected.includes(seat.id));
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const director =
    movie.crew?.find((person) => /director/i.test(person.role ?? ""))?.name ??
    movie.crew?.[0]?.name;
  const starring = (movie.castMembers ?? [])
    .slice(0, 3)
    .map((person) => person.name)
    .join(", ");
  const trailer = movie.trailerUrl || movie.videos?.[0]?.watchUrl;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function toggleSeat(seat: SeatCell) {
    if (seat.status === "occupied") return;
    setSelected((current) =>
      current.includes(seat.id)
        ? current.filter((id) => id !== seat.id)
        : current.length >= 8
          ? current
          : [...current, seat.id],
    );
  }

  function openSeats(nextDate: string, nextShowId: string) {
    const params = new URLSearchParams({
      theatre: theatreId,
      show: nextShowId,
      date: nextDate,
    });
    router.push(`/movies/${movie.id}/seats?${params.toString()}`);
  }

  function pickDate(iso: string) {
    if (iso === dateIso) return;
    const shows =
      getMovieTheatres(movie.id, iso).find((item) => item.id === theatreId)
        ?.showtimes ?? [];
    const match =
      shows.find((item) => item.label === show?.label) ?? shows[0];
    if (!match) return;
    openSeats(iso, match.id);
  }

  function continueCheckout() {
    if (!selected.length || secondsLeft === 0) return;
    const params = new URLSearchParams({
      theatre: theatreId,
      show: showId,
      date: dateIso,
      seats: selected.join(","),
    });
    gate(() =>
      router.push(`/movies/${movie.id}/checkout?${params.toString()}`),
    );
  }

  return (
    <div className="relative min-h-svh bg-bg pt-(--vybe-header-h) text-text">
      {modal}
      {movie.backdropUrl ? (
        <div className="pointer-events-none absolute top-0 right-0 h-[calc(340px+var(--vybe-header-h))] w-full overflow-hidden sm:w-[78%] lg:w-[58%]">
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            className="object-cover object-right"
            sizes="70vw"
          />
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-bg" />
        </div>
      ) : null}
      <div className="relative mx-auto grid w-full max-w-[1280px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden px-6 py-8 lg:block lg:px-8 lg:py-10">
          <div className="relative mx-auto w-full max-w-[240px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-black/40">
              <Image
                src={movie.posterUrl}
                alt=""
                fill
                className="object-cover"
                sizes="240px"
                priority
              />
            </div>
            {trailer ? (
              <a
                href={trailer}
                target="_blank"
                rel="noreferrer"
                aria-label="Watch trailer"
                className="absolute -bottom-5 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-[#ff3b4a] shadow-[0_0_28px_rgba(255,59,74,0.55)]"
              >
                <Play className="ml-0.5 size-5 fill-white text-white" />
              </a>
            ) : null}
          </div>

          <dl className="mx-auto mt-12 max-w-[240px] space-y-4 text-[13px] leading-snug">
            <div>
              <dt className="font-semibold">Director</dt>
              <dd className="text-text-secondary">{director || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Starring</dt>
              <dd className="text-text-secondary">{starring || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Genre</dt>
              <dd className="text-text-secondary">
                {movie.genres.slice(0, 3).join(", ") || "—"}
              </dd>
            </div>
          </dl>
        </aside>

        <section className="relative min-w-0 px-4 pt-3 pb-6 sm:px-6 lg:px-8 lg:pt-4 lg:pb-8">
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="max-w-xl text-[32px] leading-none font-medium tracking-[-0.03em] sm:text-[40px]">
                {movie.title}
              </h1>
              <div className="flex items-center gap-2">
                {movie.duration ? (
                  <span className="rounded-full border border-border bg-bg/70 px-3 py-1 text-[12px] text-text backdrop-blur-sm">
                    {movie.duration}
                  </span>
                ) : null}
                {movie.certification ? (
                  <span className="rounded-full border border-border bg-bg/70 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
                    {movie.certification}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[15px] text-text">{longDate(dateIso)}</p>
                {theatre ? (
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {theatre.name}
                    {theatre.area ? ` · ${theatre.area}` : ""}
                  </p>
                ) : null}
                <div className="mt-3 flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                  {dates.map((date) => {
                    const active = date.iso === dateIso;
                    return (
                      <button
                        key={date.iso}
                        type="button"
                        onClick={() => pickDate(date.iso)}
                        className="flex w-9 shrink-0 flex-col items-center gap-2"
                      >
                        <span className="text-[10px] font-semibold tracking-wide text-text-muted uppercase">
                          {date.weekday.slice(0, 3)}
                        </span>
                        <span
                          className={`grid size-8 place-items-center rounded-full text-[14px] ${
                            active
                              ? "bg-[#2ee6a8] font-semibold text-[#10241c]"
                              : "text-text hover:bg-surface-muted"
                          }`}
                        >
                          {date.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-text-muted uppercase">
                  Show time
                </p>
                <div className="mt-2 flex gap-2 overflow-x-auto hide-scrollbar">
                  {dayShows.map((item) => {
                    const active = item.id === showId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openSeats(dateIso, item.id)}
                        className={`shrink-0 rounded-md border px-3 py-1.5 text-[13px] ${
                          active
                            ? "border-[#1f9a6e] bg-bg/70 text-[#1f9a6e] backdrop-blur-sm dark:border-[#2ee6a8] dark:text-[#2ee6a8]"
                            : "border-border bg-bg/70 text-text-secondary backdrop-blur-sm hover:border-text-muted"
                        }`}
                      >
                        {clock(item.startsAt, item.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-8 h-12 max-w-3xl">
              <svg
                viewBox="0 0 640 48"
                className="h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M24 40 Q320 4 616 40"
                  fill="none"
                  stroke="#ff5d6c"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="absolute inset-x-0 bottom-0 text-center text-[10px] font-semibold tracking-[0.42em] text-text-muted">
                SCREEN
              </p>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="mx-auto w-max min-w-full space-y-1.5">
                {map.categories.map((category) =>
                  category.rows.map((row) => {
                    const rowSeats = map.seats.filter((seat) => seat.row === row);
                    const left = rowSeats.filter((seat) => seat.number <= 8);
                    const right = rowSeats.filter((seat) => seat.number > 8);
                    const label = row === "BOX" ? "L" : row;
                    return (
                      <div
                        key={row}
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="w-4 text-center text-[11px] text-text-muted">
                          {label}
                        </span>
                        <div className="flex gap-1">
                          {left.map((seat) => (
                            <SeatButton
                              key={seat.id}
                              seat={seat}
                              selected={selected.includes(seat.id)}
                              onToggle={() => toggleSeat(seat)}
                            />
                          ))}
                        </div>
                        <div className="w-5" />
                        <div className="flex gap-1">
                          {right.map((seat) => (
                            <SeatButton
                              key={seat.id}
                              seat={seat}
                              selected={selected.includes(seat.id)}
                              onToggle={() => toggleSeat(seat)}
                            />
                          ))}
                        </div>
                        <span className="w-4 text-center text-[11px] text-text-muted">
                          {label}
                        </span>
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-secondary">
                <Legend swatch="bg-[#2ee6a8]" label="Selected" />
                <Legend swatch="bg-[#d5d8de] dark:bg-[#3c4650]" label="Available" />
                <Legend swatch="bg-[#ff4d62]" label="Taken" />
                <span className="text-text-muted">
                  {selected.length
                    ? `${selected.join(", ")} · ${formatInr(total)}`
                    : `Hold ${mm}:${ss}`}
                </span>
              </div>
              <button
                type="button"
                aria-label="Continue to purchase"
                disabled={!selected.length || secondsLeft === 0}
                onClick={continueCheckout}
                className="grid size-12 place-items-center rounded-full bg-[#2ee6a8] text-[#10241c] shadow-[0_8px_24px_rgba(46,230,168,0.35)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  selected,
  onToggle,
}: {
  seat: SeatCell;
  selected: boolean;
  onToggle: () => void;
}) {
  const occupied = seat.status === "occupied";
  return (
    <button
      type="button"
      disabled={occupied}
      onClick={onToggle}
      aria-label={`${occupied ? "Taken" : selected ? "Selected" : "Available"} seat ${seat.id}${occupied ? "" : `, ${formatInr(seat.price)}`}`}
      title={`${seat.id} · ${formatInr(seat.price)}`}
      className={`h-3.5 w-5 rounded-[3px] transition-colors sm:h-4 sm:w-6 ${
        occupied
          ? "cursor-not-allowed bg-[#ff4d62]"
          : selected
            ? "bg-[#2ee6a8]"
            : "bg-[#d5d8de] hover:bg-[#c5c9d1] dark:bg-[#3c4650] dark:hover:bg-[#52606c]"
      }`}
    />
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-4 rounded-[2px] ${swatch}`} />
      {label}
    </span>
  );
}
