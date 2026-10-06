"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";
import type { PlayItem } from "@/types/play";
import { trackRecentView } from "@/lib/recent/storage";

type PlayCardProps = {
  item: PlayItem;
  className?: string;
};

export function PlayCard({ item, className = "" }: PlayCardProps) {
  return (
    <Link
      href={`/play/${item.id}`}
      onClick={() =>
        trackRecentView({
          id: item.id,
          title: item.title,
          href: `/play/${item.id}`,
          imageUrl: item.imageUrl,
          meta: item.venue || item.schedule,
          category: "play",
        })
      }
      className={`group flex w-[220px] shrink-0 snap-start flex-col sm:w-[240px] ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-[#ECECEE]">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="240px"
        />
      </div>
      <div className="pt-3">
        <div className="flex items-start gap-1 text-[12px] text-text-secondary">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">{item.venue}</span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold text-text">
          {item.title}
        </h3>
        <p className="mt-1 truncate text-[12px] leading-4 text-text-secondary">
          {item.schedule}
        </p>
      </div>
    </Link>
  );
}

type PlayCarouselProps = {
  items: PlayItem[];
};

export function PlayCarousel({ items }: PlayCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {items.map((item) => (
          <PlayCard key={item.id} item={item} />
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll play"
        onClick={() =>
          scrollerRef.current?.scrollBy({ left: 260, behavior: "smooth" })
        }
        className="absolute top-[38%] right-0 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-text shadow-md md:inline-flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
