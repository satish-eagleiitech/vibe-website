"use client";

import Image from "next/image";
import { ChevronRight, Play } from "lucide-react";
import { useRef } from "react";
import type { MovieVideo } from "@/types/movie";

type MovieTrailersRailProps = {
  videos: MovieVideo[];
  /** Pipe-separated meta under each title, e.g. cast · crew */
  metaLine?: string;
};

export function MovieTrailersRail({ videos, metaLine }: MovieTrailersRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (videos.length === 0) return null;

  function scrollNext() {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-trailer-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: step, behavior: "smooth" });
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px] lg:text-[24px]">
          Trailers & Videos
        </h2>
        {videos.length > 2 ? (
          <button
            type="button"
            aria-label="Scroll trailers"
            onClick={scrollNext}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ChevronRight className="size-4" />
          </button>
        ) : null}
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-1"
      >
        {videos.map((video) => (
          <a
            key={video.id}
            data-trailer-card
            href={video.watchUrl}
            target="_blank"
            rel="noreferrer"
            className="group w-[min(78vw,260px)] shrink-0 sm:w-[240px] md:w-[280px] lg:w-[300px]"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-muted sm:rounded-2xl">
              <Image
                src={video.thumbnailUrl}
                alt={video.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 72vw, 260px"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition-transform group-hover:scale-105 sm:size-12">
                  <Play className="size-5 fill-white" />
                </span>
              </span>
              <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                {video.type || "Video"}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] leading-snug font-bold text-text sm:text-[14px]">
              {video.name}
            </p>
            {metaLine ? (
              <p className="mt-0.5 line-clamp-1 text-[11px] text-text-secondary sm:text-[12px]">
                {metaLine}
              </p>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}
