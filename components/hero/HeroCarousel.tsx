"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, MapPin, Ticket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BookmarkButton } from "@/components/hero/BookmarkButton";
import type { HeroBannerData } from "@/types/hero";

type HeroCarouselProps = {
  slides: HeroBannerData[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];

  const goTo = useCallback(
    (next: number) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!slide) return null;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative min-h-[360px] w-full md:min-h-[460px] lg:min-h-[520px]">
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
              alt={item.imageAlt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        <div className="absolute top-5 left-4 z-10 flex flex-wrap items-center gap-2 md:top-8 md:left-10 lg:left-12">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-md">
            <Flame className="size-3.5" />
            {slide.statusBadge}
          </span>
          <span className="rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold text-text backdrop-blur-md">
            {slide.locationBadge}
          </span>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-none flex-col justify-end gap-6 px-4 pb-10 text-white md:min-h-[460px] md:flex-row md:items-end md:justify-between md:px-10 md:pb-14 lg:min-h-[520px] lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/80">
              <MapPin className="size-4 text-accent" />
              <span>{slide.venue}</span>
              <span aria-hidden="true">•</span>
              <span>{slide.dateLabel}</span>
            </div>
            <h1 className="text-[32px] leading-[38px] font-extrabold tracking-tight md:text-[44px] md:leading-[52px]">
              {slide.title}
            </h1>
            <p className="mt-2 line-clamp-2 max-w-xl text-base text-white/80">
              {slide.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#E70052] active:scale-95"
            >
              <Ticket className="size-5" />
              {slide.ctaLabel}
            </Link>
            <BookmarkButton
              item={{
                id: slide.id,
                title: slide.title,
                href: slide.href,
                imageUrl: slide.imageUrl,
                meta: slide.venue,
                category: slide.category,
              }}
            />
          </div>
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(index - 1)}
              className="absolute top-1/2 left-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 md:inline-flex"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(index + 1)}
              className="absolute top-1/2 right-3 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 md:inline-flex"
            >
              <ChevronRight className="size-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to ${item.statusBadge} slide`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-accent" : "w-2 bg-white/50 hover:bg-white/80"
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
