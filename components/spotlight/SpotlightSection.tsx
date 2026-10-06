"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { SpotlightCard } from "@/components/spotlight/SpotlightCard";
import type { Movie } from "@/types/movie";

type SpotlightSectionProps = {
  movies: Movie[];
};

export function SpotlightSection({ movies }: SpotlightSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8;
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="w-full bg-bg py-10 md:bg-surface-muted/60 md:py-12">
      <Container>
        <div className="mb-6 flex items-center justify-between md:mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-[30px] leading-[38px] font-extrabold tracking-tight text-text">
              In the spotlight
            </h2>
            <span className="size-2.5 rounded-full bg-accent" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous spotlight"
              onClick={() => scroll("prev")}
              className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-text shadow-sm transition-colors hover:bg-[#ECECEE]"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next spotlight"
              onClick={() => scroll("next")}
              className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-text shadow-sm transition-colors hover:bg-[#ECECEE]"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {movies.length === 0 ? (
          <EmptyState
            title="Spotlight titles will appear here"
            description="Connect the movie API to load now-showing films."
          />
        ) : (
          <div
            ref={scrollerRef}
            className="hide-scrollbar grid auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0"
          >
            {movies.map((movie) => (
              <SpotlightCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
