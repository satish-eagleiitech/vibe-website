"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Movie } from "@/types/movie";

type MovieHeroCarouselProps = {
  movies: Movie[];
};

type SlideNav = { index: number; prev: number; dir: 1 | -1 };

const SLIDE_MS = 5000;

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function MovieHeroCarousel({ movies }: MovieHeroCarouselProps) {
  const slides = movies.filter((movie) => movie.backdropUrl || movie.posterUrl);
  const [nav, setNav] = useState<SlideNav>({ index: 0, prev: -1, dir: 1 });
  const remainingRef = useRef(SLIDE_MS);
  const count = slides.length;
  const { index, prev, dir } = nav;
  const slide = slides[index];
  const animating = prev >= 0;

  useEffect(() => {
    remainingRef.current = SLIDE_MS;
  }, [index]);

  useEffect(() => {
    if (count < 2) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(
      () => setNav((cur) => ({ index: (cur.index + 1) % count, prev: cur.index, dir: 1 })),
      remainingRef.current,
    );
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
    };
  }, [index, count]);

  if (!slide) return null;

  const layer = (i: number) => (i === index ? "z-[2]" : i === prev ? "z-[1]" : "z-0 opacity-0");
  const textStack = [prev, index].filter((i, n, all) => i >= 0 && all.indexOf(i) === n);

  return (
    <section
      className="relative w-full overflow-hidden bg-black lg:-mt-[var(--vybe-header-h)]"
      style={{ "--exo-dir": dir } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="New movies"
    >
      <div className="relative h-[min(680px,100svh)] min-h-[500px] w-full lg:h-screen lg:min-h-[100dvh]">
        {slides.map((item, i) => (
          <div key={item.id} className={`absolute inset-0 ${layer(i)}`} aria-hidden={i !== index}>
            <div className={`absolute inset-0 overflow-hidden ${i === index && animating ? "exo-wipe" : ""}`}>
              <Image
                src={item.backdropUrl || item.posterUrl}
                alt={`${item.title} backdrop`}
                fill
                priority={i === 0}
                className={`object-cover object-center ${
                  i === index && animating ? "exo-settle" : i === prev ? "exo-recede" : ""
                }`}
                sizes="100vw"
              />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_right,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.32)_42%,rgba(0,0,0,0)_64%)]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_top,rgba(0,0,0,0.6),rgba(0,0,0,0)_36%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="absolute top-1/2 right-[8vw] z-[4] hidden aspect-[2/3] w-[18vw] max-w-[300px] -translate-y-1/2 overflow-hidden rounded-xl bg-[#111] shadow-[0_40px_90px_rgba(0,0,0,0.35)] lg:block">
          {slides.map((item, i) => (
            <div
              key={item.id}
              className={`absolute inset-0 overflow-hidden rounded-xl ${layer(i)} ${
                i === index && animating ? "exo-wipe-rev" : ""
              }`}
              aria-hidden
            >
              <Image
                src={item.posterUrl || item.backdropUrl || ""}
                alt=""
                fill
                className={`object-cover ${
                  i === index && animating ? "exo-drop" : i === prev ? "exo-push" : ""
                }`}
                sizes="300px"
              />
            </div>
          ))}
        </div>

        <div className="relative z-[5] mx-auto flex h-full w-full flex-col justify-end px-5 pt-10 pb-14 sm:px-8 md:px-12 md:pb-24 lg:justify-center lg:px-[7vw] lg:pt-24 lg:pb-24">
          <div className="grid max-w-[560px] overflow-hidden pb-3 lg:w-[min(38vw,560px)] 3xl:max-w-[720px]">
            {textStack.map((i) => {
              const item = slides[i];
              const active = i === index;
              const meta = [
                item.certification,
                item.duration,
                item.releaseDate?.slice(0, 4),
                item.languages[0] ? titleCase(item.languages[0]) : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <div
                  key={item.id}
                  aria-hidden={!active}
                  className={`[grid-area:1/1] ${
                    active ? (animating ? "exo-rise-in" : "") : "exo-rise-out pointer-events-none"
                  }`}
                >
                  {item.genres.length ? (
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase md:text-[12px]">
                      {item.genres.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                  <h1 className="mt-3 text-[34px] leading-[0.98] font-semibold tracking-[-0.03em] break-words text-white sm:text-[44px] lg:text-[clamp(2.4rem,4vw,4.2rem)]">
                    {item.title}
                  </h1>
                  <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[13px] tracking-[0.04em] text-white/85">
                    <span className="font-bold text-accent">{item.formatBadge || "New Release"}</span>
                    {meta ? <span aria-hidden>·</span> : null}
                    {meta}
                  </p>
                  <p className="mt-4 line-clamp-3 max-w-[40ch] text-[14px] leading-6 font-light text-white/90 md:text-[15px]">
                    {item.description || "Discover this title in theatres near you on VYBE."}
                  </p>

                  <div className="mt-7 flex items-center gap-3">
                    <Link
                      href={`/movies/${item.id}/book`}
                      tabIndex={active ? undefined : -1}
                      className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02] sm:min-w-[220px] sm:flex-none sm:px-8"
                    >
                      <Ticket className="size-5" />
                      Book Tickets
                    </Link>
                    <Link
                      href={`/movies/${item.id}`}
                      tabIndex={active ? undefined : -1}
                      className="inline-flex size-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                      aria-label={`Details for ${item.title}`}
                    >
                      <Plus className="size-6" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 ? (
          <div
            className="absolute right-8 bottom-8 z-[6] hidden items-baseline gap-[0.18em] text-[14px] tracking-[0.05em] text-white tabular-nums md:flex lg:right-12"
            aria-hidden
          >
            <div className="relative grid h-4 w-[2ch] overflow-hidden leading-4">
              {textStack.map((i) => (
                <p
                  key={slides[i].id}
                  className={`[grid-area:1/1] ${
                    i === index ? (animating ? "exo-rise-in" : "") : "exo-rise-out"
                  }`}
                >
                  {pad(i + 1)}
                </p>
              ))}
            </div>
            <p className="opacity-50">/</p>
            <p className="opacity-50">{pad(count)}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
