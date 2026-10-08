"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/common/Container";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import type { LandingVideoCard } from "@/lib/data/landingExtras";
import { trackRecentView } from "@/lib/recent/storage";

const RAIL_CARD_SLOT =
  "w-[46%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]";

type VideoRailSectionProps = {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  items: LandingVideoCard[];
};

function recentCategory(href: string) {
  if (href.includes("/play")) return "play" as const;
  if (href.includes("/activities")) return "activities" as const;
  return "events" as const;
}

function VideoCard({ item }: { item: LandingVideoCard }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 0.75] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const meta = item.venue || item.schedule || item.subtitle || "";

  return (
    <Link
      ref={cardRef}
      href={item.href}
      onClick={() =>
        trackRecentView({
          id: item.id,
          title: item.title,
          href: item.href,
          imageUrl: item.posterUrl,
          meta,
          category: recentCategory(item.href),
        })
      }
      className="group flex w-full flex-col"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
        <Image
          src={item.posterUrl}
          alt=""
          fill
          className={`object-cover transition-opacity duration-500 ${
            ready && inView ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready && inView ? "opacity-100" : "opacity-0"
          }`}
          src={item.videoUrl}
          muted={muted}
          loop
          playsInline
          autoPlay
          preload="auto"
          onLoadedData={() => setReady(true)}
        />
        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setMuted((value) => !value);
          }}
          className="absolute right-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md"
        >
          {muted ? (
            <VolumeX className="size-3.5" />
          ) : (
            <Volume2 className="size-3.5" />
          )}
        </button>
      </div>
      <h3 className="mt-2 line-clamp-1 text-[13px] font-semibold text-text sm:text-[14px]">
        {item.title}
      </h3>
      {meta ? (
        <p className="mt-0.5 line-clamp-1 text-[12px] text-text-secondary">
          {meta}
        </p>
      ) : null}
    </Link>
  );
}

export function VideoRailSection({
  title,
  description,
  href = "/events",
  linkLabel = "See all",
  items,
}: VideoRailSectionProps) {
  const { scrollerRef, pager, onScroll, scrollBy } = useRailPager();

  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[15px] text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[15px] font-bold text-accent"
          >
            {linkLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div>
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="hide-scrollbar flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {items.map((item) => (
              <div key={item.id} data-rail-card className={RAIL_CARD_SLOT}>
                <VideoCard item={item} />
              </div>
            ))}
          </div>
          <RailPager
            pager={pager}
            onPrev={() => scrollBy(-1)}
            onNext={() => scrollBy(1)}
            prevLabel={`Previous ${title}`}
            nextLabel={`Next ${title}`}
          />
        </div>
      </Container>
    </section>
  );
}
