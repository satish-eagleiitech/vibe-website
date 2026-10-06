"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/common/Container";
import type { LandingArtist } from "@/lib/data/landingExtras";

type EventArtistsRowProps = {
  artists: LandingArtist[];
};

export function EventArtistsRow({ artists }: EventArtistsRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: number) {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  if (artists.length === 0) return null;

  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <h2 className="mb-5 text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          Artists on VYBE
        </h2>
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label="Previous artists"
            onClick={() => scrollBy(-1)}
            className="mt-[50px] hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md sm:mt-[62px] md:inline-flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div
            ref={scrollerRef}
            className="hide-scrollbar flex min-w-0 flex-1 gap-6 overflow-x-auto pb-2 sm:gap-8"
          >
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={artist.href}
                className="group flex w-[148px] shrink-0 flex-col items-center text-center sm:w-[172px]"
              >
                <div className="relative size-[140px] overflow-hidden rounded-full bg-surface-muted ring-2 ring-border transition-transform group-hover:scale-105 sm:size-[164px]">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="164px"
                  />
                </div>
                <span className="mt-3 line-clamp-2 text-[13px] font-bold text-text">
                  {artist.name}
                </span>
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next artists"
            onClick={() => scrollBy(1)}
            className="mt-[50px] hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text shadow-md sm:mt-[62px] md:inline-flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
