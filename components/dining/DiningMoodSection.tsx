"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import { diningMoods } from "@/lib/data/diningMoods";

type DiningMoodSectionProps = {
  activeMood?: string;
};

export function DiningMoodSection({ activeMood }: DiningMoodSectionProps) {
  const { scrollerRef, pager, onScroll, scrollBy } = useRailPager();

  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          What&apos;s your mood?
        </h2>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="hide-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1 sm:gap-5"
        >
          {diningMoods.map((mood) => {
            const active = activeMood === mood.id;
            return (
              <Link
                key={mood.id}
                href={active ? "/dining" : `${mood.href}#mood-restaurants`}
                data-rail-card
                className={`group relative block h-[300px] w-[200px] shrink-0 overflow-hidden border sm:h-[340px] sm:w-[220px] md:h-[380px] md:w-[240px] ${
                  active ? "border-accent" : "border-border"
                }`}
                style={{ backgroundColor: mood.tone }}
              >
                <Image
                  src={mood.imageUrl}
                  alt={mood.label}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="240px"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.35) 100%)",
                  }}
                />
                <span className="absolute bottom-3 left-1/2 z-10 max-w-[88%] -translate-x-1/2 truncate rounded-sm bg-black/40 px-3 py-1.5 text-center text-[11px] font-extrabold tracking-[0.08em] text-white uppercase backdrop-blur-md sm:bottom-4 sm:text-[12px]">
                  {mood.label}
                </span>
              </Link>
            );
          })}
        </div>
        <RailPager
          pager={pager}
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
          prevLabel="Previous moods"
          nextLabel="Next moods"
        />
      </Container>
    </section>
  );
}
