"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlayItem } from "@/types/play";

type PlayHeroCarouselProps = {
  items: PlayItem[];
};

export function PlayHeroCarousel({ items }: PlayHeroCarouselProps) {
  const slides = items.filter((item) => item.imageUrl);
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index];

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [count, index]);

  if (!slide) return null;

  function go(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  const meta = [
    slide.sport,
    slide.locality || slide.venue,
    slide.distanceKm != null ? `${slide.distanceKm} km` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="relative w-full overflow-hidden bg-black lg:-mt-[60px]">
      <div className="relative h-[min(680px,calc(100svh-var(--vybe-header-h)))] min-h-[500px] w-full lg:h-screen lg:min-h-[100dvh]">
        {slides.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              priority={i === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/30" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full w-full flex-col justify-end px-5 pt-10 pb-14 sm:px-8 md:px-12 md:pb-16 lg:px-16 lg:pt-32 xl:px-20 3xl:px-28">
          <div className="max-w-[560px] 3xl:max-w-[720px]">
            <h1 className="text-[34px] leading-[1.02] font-extrabold tracking-tight break-words text-white uppercase sm:text-[48px] md:text-[60px] lg:text-[72px] 3xl:text-[88px]">
              {slide.title}
            </h1>
            <p className="mt-3 text-[13px] font-bold text-accent md:text-[14px]">
              {slide.kind === "event" ? "Sporting Event" : "Play near you"}
            </p>
            {meta ? (
              <p className="mt-2 text-[14px] font-semibold text-white/85 md:text-[15px]">
                {meta}
              </p>
            ) : null}
            <p className="mt-3 line-clamp-3 max-w-[520px] text-[14px] leading-6 text-white/75 md:text-[15px] md:leading-7">
              {slide.description}
            </p>
            <p className="mt-3 text-[13px] font-semibold text-white/60">
              {slide.schedule}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <Link
                href={`/play/${slide.id}/book`}
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 sm:min-w-[220px] sm:flex-none sm:px-8 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02]"
              >
                <CalendarDays className="size-5" />
                {slide.kind === "event" ? "Book tickets" : "Book a slot"}
              </Link>
              <Link
                href={`/play/${slide.id}`}
                className="inline-flex size-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                aria-label={`Details for ${slide.title}`}
              >
                <Plus className="size-6" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous play highlight"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/65 md:left-6 md:inline-flex"
            >
              <ChevronLeft className="size-6" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Next play highlight"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/65 md:right-6 md:inline-flex"
            >
              <ChevronRight className="size-6" strokeWidth={2.25} />
            </button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-7">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-accent"
                      : "w-2 bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
