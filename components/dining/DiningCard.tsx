"use client";

import Image from "next/image";
import Link from "next/link";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import type { DiningSpot } from "@/types/dining";
import { trackRecentView } from "@/lib/recent/storage";

type DiningCardProps = {
  spot: DiningSpot;
  className?: string;
};

export function DiningCard({ spot, className = "" }: DiningCardProps) {
  return (
    <Link
      href={`/dining/${spot.id}`}
      onClick={() =>
        trackRecentView({
          id: spot.id,
          title: spot.name,
          href: `/dining/${spot.id}`,
          imageUrl: spot.imageUrl,
          meta: `${spot.cuisine} · ${spot.locality}`,
          category: "dining",
        })
      }
      className={`group flex w-full flex-col ${className}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
        <Image
          src={spot.imageUrl}
          alt={spot.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>
      <h3 className="mt-2 line-clamp-1 text-[13px] font-semibold text-text sm:text-[14px]">
        {spot.name}
      </h3>
      <p className="mt-0.5 text-[12px] text-text-secondary">{spot.locality}</p>
    </Link>
  );
}

type DiningCarouselProps = {
  spots: DiningSpot[];
};

export function DiningCarousel({ spots }: DiningCarouselProps) {
  const { scrollerRef, pager, onScroll, scrollBy } = useRailPager();

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="hide-scrollbar flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {spots.map((spot) => (
          <div
            key={spot.id}
            data-rail-card
            className="w-[46%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]"
          >
            <DiningCard spot={spot} />
          </div>
        ))}
      </div>
      <RailPager
        pager={pager}
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
        prevLabel="Previous restaurants"
        nextLabel="Next restaurants"
      />
    </div>
  );
}
