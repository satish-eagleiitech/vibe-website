"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Play,
  RefreshCw,
  Ticket,
} from "lucide-react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { Container } from "@/components/common/Container";
import {
  buildSeatMap,
  findShowtime,
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

function formatDateLabel(iso: string) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SeatPicker({
  movie,
  theatreId,
  showId,
  dateIso,
}: SeatPickerProps) {
  const router = useRouter();
  const { gate, modal } = useLoginGate();
  const { theatre, show } = findShowtime(
    movie.id,
    theatreId,
    showId,
    dateIso,
  );
  const map = useMemo(() => buildSeatMap(showId), [showId]);
  const [selected, setSelected] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedSeats = map.seats.filter((seat) => selected.includes(seat.id));
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const byCategory = selectedSeats.reduce<
    Record<string, { count: number; price: number; seats: string[] }>
  >((acc, seat) => {
    const key = seat.category;
    if (!acc[key]) acc[key] = { count: 0, price: seat.price, seats: [] };
    acc[key].count += 1;
    acc[key].seats.push(seat.id);
    return acc;
  }, {});

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

  function continueCheckout() {
    if (!selected.length) return;
    const params = new URLSearchParams({
      theatre: theatreId,
      show: showId,
      date: dateIso,
      seats: selected.join(","),
    });
    gate(() => router.push(`/movies/${movie.id}/checkout?${params.toString()}`));
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="w-full bg-bg pb-28 md:pb-10">
      {modal}
      {/* Progress */}
      <div className="border-b border-border bg-surface">
        <Container className="flex items-center justify-between gap-3 py-3 md:py-4">
          <Link
            href={`/movies/${movie.id}/book`}
            className="inline-flex items-center gap-1 text-[12px] font-bold tracking-wide text-text-secondary uppercase hover:text-text"
          >
            <ChevronLeft className="size-4" />
            Back
          </Link>

          <ol className="flex items-center gap-4 text-[11px] font-extrabold tracking-[0.08em] uppercase md:gap-8 md:text-[12px]">
            <li className="text-text-muted">
              <span className="text-text-faint">01</span> Overview
            </li>
            <li className="text-accent">
              <span className="mr-1">02</span> Seats
            </li>
            <li className="text-text-muted">
              <span className="text-text-faint">03</span> Pay
            </li>
          </ol>

          <span className="hidden w-16 md:block" aria-hidden="true" />
        </Container>
      </div>

      <Container className="py-5 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main */}
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(17,24,39,0.06)] md:p-6">
              {movie.backdropUrl ? (
                <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
                  <Image
                    src={movie.backdropUrl}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="800px"
                  />
                </div>
              ) : null}

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[22px] font-extrabold tracking-tight text-text md:text-[28px]">
                        {movie.title}
                      </h1>
                      {movie.certification ? (
                        <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-bold text-text-secondary">
                          {movie.certification}
                        </span>
                      ) : null}
                      {movie.duration ? (
                        <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-bold text-text-secondary">
                          {movie.duration}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-text-secondary md:text-[13px]">
                      {movie.description ||
                        movie.genres.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-y border-border py-3 text-[12px] md:gap-6">
                  <div>
                    <p className="font-bold tracking-wide text-text-muted uppercase">
                      Cinema
                    </p>
                    <p className="mt-0.5 font-extrabold text-text">
                      {theatre?.name ?? "Theatre"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold tracking-wide text-text-muted uppercase">
                      Date
                    </p>
                    <p className="mt-0.5 font-extrabold text-text">
                      {formatDateLabel(dateIso)}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold tracking-wide text-text-muted uppercase">
                      Showtime
                    </p>
                    <p className="mt-0.5 font-extrabold text-text">
                      {show?.label ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-secondary md:text-[12px]">
                  <LegendTone tone="available" label="Available" />
                  <LegendTone tone="booked" label="Booked" />
                  <LegendTone tone="selected" label="Selected" />
                </div>

                {/* Screen */}
                <div className="mx-auto mt-8 mb-6 flex max-w-lg flex-col items-center">
                  <p className="mb-2 text-[10px] font-extrabold tracking-[0.22em] text-accent uppercase">
                    Screen
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-90" />
                  <div className="mt-1 h-8 w-[88%] rounded-[50%] border-t-2 border-accent/35" />
                </div>

                {/* Seats */}
                <div className="space-y-7">
                  {map.categories.map((category) => {
                    const rows = category.rows;
                    return (
                      <div key={category.name}>
                        <div className="mb-3 flex items-center gap-3">
                          <div className="h-px flex-1 bg-border" />
                          <p className="text-[11px] font-extrabold tracking-[0.12em] text-text-secondary uppercase">
                            {category.name} · {formatInr(category.price)}
                          </p>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="mx-auto max-w-2xl space-y-2">
                          {rows.map((row) => {
                            const rowSeats = map.seats.filter(
                              (seat) => seat.row === row,
                            );
                            const left = rowSeats.filter((s) => s.number <= 8);
                            const right = rowSeats.filter((s) => s.number > 8);
                            const isLove =
                              category.name === "BOX" ||
                              category.name.toLowerCase().includes("love");

                            return (
                              <div
                                key={row}
                                className="flex items-center justify-center gap-1.5 md:gap-2"
                              >
                                <span className="w-5 text-center text-[11px] font-bold text-text-muted md:w-6">
                                  {row === "BOX" ? "★" : row}
                                </span>
                                <div className="flex gap-1 md:gap-1.5">
                                  {left.map((seat) => (
                                    <SeatButton
                                      key={seat.id}
                                      seat={seat}
                                      selected={selected.includes(seat.id)}
                                      love={isLove}
                                      onToggle={() => toggleSeat(seat)}
                                    />
                                  ))}
                                </div>
                                <div className="w-3 md:w-6" />
                                <div className="flex gap-1 md:gap-1.5">
                                  {right.map((seat) => (
                                    <SeatButton
                                      key={seat.id}
                                      seat={seat}
                                      selected={selected.includes(seat.id)}
                                      love={isLove}
                                      onToggle={() => toggleSeat(seat)}
                                    />
                                  ))}
                                </div>
                                <span className="w-5 text-center text-[11px] font-bold text-text-muted md:w-6">
                                  {row === "BOX" ? "★" : row}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-text-secondary">
                    <span>Regular seats</span>
                    <span>Box / Love</span>
                    <span>VIP / Executive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className={`text-[12px] font-extrabold ${
                        secondsLeft < 60 ? "text-accent" : "text-emerald-600"
                      }`}
                    >
                      Remaining: {mm}:{ss}
                    </p>
                    <button
                      type="button"
                      aria-label="Clear selection"
                      onClick={() => setSelected([])}
                      className="inline-flex size-8 items-center justify-center rounded-full border border-border text-text-secondary hover:border-accent/40 hover:text-accent"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar summary */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_12px_40px_rgba(17,24,39,0.06)]">
              <div className="relative aspect-[2/3] w-full bg-surface-muted">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                {movie.trailerUrl || movie.videos?.[0]?.watchUrl ? (
                  <a
                    href={movie.trailerUrl || movie.videos?.[0]?.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[12px] font-extrabold text-white shadow-lg"
                  >
                    <Play className="size-3.5 fill-current" />
                    Watch trailer
                  </a>
                ) : null}
              </div>

              <div className="p-4 md:p-5">
                <h2 className="text-[15px] font-extrabold text-text">
                  Your seats
                </h2>

                {selected.length === 0 ? (
                  <p className="mt-3 text-[13px] text-text-secondary">
                    Tap seats on the map to add them here.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {Object.entries(byCategory).map(([name, info]) => (
                      <li
                        key={name}
                        className="flex items-start justify-between gap-3 text-[13px]"
                      >
                        <span>
                          <span className="block font-bold text-text">
                            {name}
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            {info.count} seat{info.count > 1 ? "s" : ""} ·{" "}
                            {info.seats.join(", ")}
                          </span>
                        </span>
                        <span className="font-extrabold text-text">
                          {formatInr(info.count * info.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                  <span className="text-[12px] font-extrabold tracking-wide text-accent uppercase">
                    Total
                  </span>
                  <span className="text-[22px] font-extrabold text-text">
                    {formatInr(total)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!selected.length || secondsLeft === 0}
                  onClick={continueCheckout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[14px] font-extrabold text-white shadow-[0_10px_28px_rgba(255,0,91,0.28)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Ticket className="size-4" />
                  {selected.length ? "Continue to pay" : "Select seats"}
                </button>

                <Link
                  href={`/movies/${movie.id}/book`}
                  className="mt-3 block text-center text-[12px] font-bold text-text-secondary hover:text-accent"
                >
                  Change showtime
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden">
        <Container className="flex items-center justify-between gap-3 py-3">
          <div>
            <p className="text-[12px] font-semibold text-text-secondary">
              {selected.length
                ? `${selected.length} seat${selected.length > 1 ? "s" : ""}`
                : "No seats yet"}
            </p>
            <p className="text-[16px] font-extrabold text-text">
              {formatInr(total)}
            </p>
          </div>
          <button
            type="button"
            disabled={!selected.length || secondsLeft === 0}
            onClick={continueCheckout}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            Continue
          </button>
        </Container>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  selected,
  love,
  onToggle,
}: {
  seat: SeatCell;
  selected: boolean;
  love?: boolean;
  onToggle: () => void;
}) {
  const occupied = seat.status === "occupied";
  return (
    <button
      type="button"
      disabled={occupied}
      onClick={onToggle}
      aria-label={`Seat ${seat.id}`}
      className={`flex items-center justify-center text-[9px] font-bold transition-colors md:text-[10px] ${
        love
          ? "h-6 w-9 rounded-full md:h-7 md:w-10"
          : "size-6 rounded-[5px] md:size-7"
      } ${
        occupied
          ? "cursor-not-allowed bg-[#D8D8DE] text-transparent"
          : selected
            ? "bg-accent text-white shadow-sm"
            : "border border-[#C8C8D0] bg-surface text-text-secondary hover:border-accent/50"
      }`}
    >
      {occupied ? "" : seat.number}
    </button>
  );
}

function LegendTone({
  tone,
  label,
}: {
  tone: "available" | "booked" | "selected";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`size-3.5 rounded-[3px] ${
          tone === "available"
            ? "border border-[#C8C8D0] bg-surface"
            : tone === "booked"
              ? "bg-[#D8D8DE]"
              : "bg-accent"
        }`}
      />
      {label}
    </span>
  );
}
