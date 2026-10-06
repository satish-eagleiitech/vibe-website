"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Play, Ticket } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { trackRecentView } from "@/lib/recent/storage";
import type { Movie } from "@/types/movie";

type LandingHeroProps = {
  movies: Movie[];
};

const AUTO_MS = 3000;
const SWIPE_PX = 48;

function wrap(index: number, count: number) {
  return ((index % count) + count) % count;
}

function circularOffset(i: number, index: number, count: number) {
  let offset = i - index;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

/** Full-bleed coverflow: center focus, extra cards visible on both sides. */
function cardStyle(offset: number): CSSProperties {
  const abs = Math.abs(offset);
  const step = 72;
  if (abs > 3) {
    return {
      opacity: 0,
      pointerEvents: "none",
      transform: `translate(-50%, -50%) translateX(${offset * step}%) scale(0.62)`,
      zIndex: 0,
    };
  }

  const scale =
    offset === 0 ? 1.12 : abs === 1 ? 0.9 : abs === 2 ? 0.78 : 0.66;
  const opacity = abs === 0 ? 1 : abs === 1 ? 1 : abs === 2 ? 0.75 : 0.45;

  return {
    opacity,
    pointerEvents: abs > 2 ? "none" : "auto",
    transform: `translate(-50%, -50%) translateX(${offset * step}%) scale(${scale})`,
    zIndex: 40 - abs * 10,
    boxShadow:
      offset === 0
        ? "0 28px 56px rgba(17,24,39,0.22)"
        : "0 12px 28px rgba(17,24,39,0.12)",
  };
}

export function LandingHero({ movies }: LandingHeroProps) {
  const router = useRouter();
  const slides = movies
    .filter((movie) => movie.posterUrl || movie.backdropUrl)
    .slice(0, 10);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; y: number; active: boolean; moved: boolean }>({
    x: 0,
    y: 0,
    active: false,
    moved: false,
  });

  const goTo = useCallback(
    (next: number) => {
      if (!count) return;
      setIndex(wrap(next, count));
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = window.setInterval(() => goTo(index + 1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [count, index, paused, goTo]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (!count) return null;

  const active = slides[index];

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      active: true,
      moved: false,
    };
    setPaused(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dx = Math.abs(event.clientX - drag.current.x);
    const dy = Math.abs(event.clientY - drag.current.y);
    if (dx > 8 || dy > 8) drag.current.moved = true;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const delta = event.clientX - drag.current.x;
    const moved = drag.current.moved;
    drag.current.active = false;
    setPaused(false);
    if (!moved) return;
    if (delta > SWIPE_PX) goTo(index - 1);
    else if (delta < -SWIPE_PX) goTo(index + 1);
  }

  function openMovie(movie: Movie, image: string) {
    trackRecentView({
      id: movie.id,
      title: movie.title,
      href: `/movies/${movie.id}`,
      imageUrl: image,
      meta: movie.genres.slice(0, 2).join(" · "),
      category: "movies",
    });
    router.push(`/movies/${movie.id}`);
  }

  return (
    <section
      className="relative w-full overflow-x-hidden bg-bg pt-4 pb-3 md:pt-5 md:pb-4"
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative mx-auto h-[340px] w-full touch-pan-y select-none sm:h-[400px] md:h-[460px] lg:h-[520px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides.map((movie, i) => {
          const offset = circularOffset(i, index, count);
          const current = i === index;
          const image = movie.posterUrl || movie.backdropUrl;
          const href = `/movies/${movie.id}`;
          const abs = Math.abs(offset);
          const clickable = abs <= 2;

          return (
            <article
              key={movie.id}
              className="absolute top-1/2 left-1/2 aspect-[3/4] w-[200px] overflow-hidden rounded-[28px] bg-surface-muted transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[210px] md:w-[250px] lg:w-[280px] xl:w-[300px]"
              style={cardStyle(offset)}
              aria-hidden={!current && !clickable}
            >
              <Image
                src={image!}
                alt={movie.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 300px"
                draggable={false}
              />

              {current ? (
                <>
                  <button
                    type="button"
                    className="absolute inset-0 z-[1] cursor-pointer"
                    aria-label={`Open ${movie.title}`}
                    onClick={() => {
                      if (drag.current.moved) return;
                      openMovie(movie, image!);
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 z-10 px-3 py-4 sm:p-4 md:p-5">
                    <button
                      type="button"
                      className="block w-full text-left"
                      onClick={() => openMovie(movie, image!)}
                    >
                      <p className="text-[10px] font-extrabold tracking-[0.16em] text-accent uppercase md:text-[11px]">
                        {movie.formatBadge || movie.statusBadge || "New"}
                      </p>
                      <h2 className="mt-1 line-clamp-2 text-[18px] leading-tight font-extrabold text-white md:text-[22px]">
                        {movie.title}
                      </h2>
                      <p className="mt-1 line-clamp-1 text-[11px] font-medium text-white/75 md:text-[12px]">
                        {[
                          movie.languages[0]
                            ? movie.languages[0][0].toUpperCase() +
                              movie.languages[0].slice(1)
                            : null,
                          movie.genres.slice(0, 2).join(" · "),
                        ]
                          .filter(Boolean)
                          .join("  •  ")}
                      </p>
                    </button>
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={`/movies/${movie.id}/book`}
                        onClick={() =>
                          trackRecentView({
                            id: movie.id,
                            title: movie.title,
                            href,
                            imageUrl: image!,
                            meta: movie.genres.slice(0, 2).join(" · "),
                            category: "movies",
                          })
                        }
                        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-2 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(255,0,91,0.32)] transition-transform hover:scale-[1.03] sm:px-4 md:text-[13px]"
                      >
                        <Ticket className="size-3.5" />
                        Book tickets
                      </Link>
                      <button
                        type="button"
                        onClick={() => openMovie(movie, image!)}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
                        aria-label={`Details for ${movie.title}`}
                      >
                        <Play className="size-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                </>
              ) : clickable ? (
                <>
                  <button
                    type="button"
                    className="absolute inset-0 z-10 cursor-pointer"
                    aria-label={`Open ${movie.title}`}
                    onClick={() => {
                      if (drag.current.moved) return;
                      openMovie(movie, image!);
                    }}
                  />
                  {abs === 1 ? (
                    <span className="pointer-events-none absolute right-3 bottom-3 z-[5] inline-flex size-8 items-center justify-center rounded-full bg-white/85 text-text shadow-sm">
                      <Play className="size-3.5 fill-current" />
                    </span>
                  ) : null}
                </>
              ) : null}
            </article>
          );
        })}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-3 md:mt-4">
          <button
            type="button"
            aria-label="Previous movie"
            onClick={() => goTo(index - 1)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-text/30"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next movie"
            onClick={() => goTo(index + 1)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-text/30"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <p className="sr-only">{active?.title}</p>
    </section>
  );
}
