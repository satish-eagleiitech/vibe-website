"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Container } from "@/components/common/Container";
import type { LandingArtist } from "@/lib/data/landingExtras";

type ArtistsSectionProps = {
  artists: LandingArtist[];
};

/** 1-based: middle = 1,3,5… · lower = 2,6,10… · higher = 4,8,12… */
type ArtistPhase = "middle" | "lower" | "higher";

function artistPhase(artistIndex: number): ArtistPhase {
  const n = artistIndex + 1;
  if (n % 4 === 0) return "higher";
  if (n % 4 === 2) return "lower";
  return "middle";
}

const PHASE_Y: Record<ArtistPhase, number> = {
  middle: 0,
  lower: 78,
  higher: -78,
};

const PHASE_Z: Record<ArtistPhase, number> = {
  middle: 24,
  lower: 18,
  higher: 18,
};

const CARD_WIDTH = { sm: 188, md: 208, lg: 220 } as const;
const DESKTOP_VISIBLE = 7;
const MOBILE_VISIBLE = 5;
/** Minimum clear gap between card edges — user-set; do not change */
const MIN_CARD_GAP = 24;

/** How quickly display progress catches up to scroll (0–1, higher = snappier) */
const PROGRESS_LERP = 0.14;

function cardWidthForViewport(width: number) {
  if (width < 640) return CARD_WIDTH.sm;
  if (width < 1024) return CARD_WIDTH.md;
  return CARD_WIDTH.lg;
}

function visibleCountForViewport(width: number) {
  return width < 768 ? MOBILE_VISIBLE : DESKTOP_VISIBLE;
}

function stepForStage(stageWidth: number, visible: number, cardWidth: number) {
  const spans = Math.max(visible - 1, 1);
  const peekStep = (stageWidth - cardWidth) / spans;
  return Math.max(peekStep, cardWidth + MIN_CARD_GAP);
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function sectionInView(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function virtualTransform(
  virtualIndex: number,
  artistIndex: number,
  stepPx: number,
  progress: number,
): CSSProperties {
  const phase = artistPhase(artistIndex);
  const x = (virtualIndex - progress) * stepPx;
  return {
    transform: `translate(-50%, -50%) translateX(${x}px) translateY(${PHASE_Y[phase]}px)`,
    zIndex: PHASE_Z[phase],
  };
}

function ArtistShowcaseCard({
  artist,
  eager,
}: {
  artist: LandingArtist;
  eager?: boolean;
}) {
  const tag = artist.tag ?? "ON VYBE";

  return (
    <div className="group relative h-[300px] w-[188px] shrink-0 overflow-hidden rounded-[28px] border border-white/25 bg-neutral-900 shadow-[0_20px_50px_rgba(17,24,39,0.28)] ring-1 ring-black/10 transition-shadow duration-500 sm:h-[340px] sm:w-[208px] md:h-[360px] md:w-[220px] dark:ring-white/15 dark:shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
      <Image
        src={artist.imageUrl}
        alt={artist.name}
        fill
        priority={eager}
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="220px"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-35 dark:opacity-45"
        style={{ backgroundColor: artist.tone }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30"
      />
      <Link
        href={artist.href}
        className="absolute inset-0 z-10 rounded-[28px]"
        aria-label={`View ${artist.name} on VYBE`}
      />
      <div className="absolute inset-x-3 bottom-3 z-20">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-xl">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30">
            <Image
              src={artist.imageUrl}
              alt=""
              fill
              className="object-cover object-top"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[14px] font-extrabold text-white">
              {artist.name}
            </p>
            <p className="truncate text-[10px] font-bold tracking-[0.14em] text-white/75 uppercase">
              {tag}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArtistsSection({ artists }: ArtistsSectionProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [stepPx, setStepPx] = useState(240);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE);

  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const count = artists.length;

  useEffect(() => {
    displayProgressRef.current = displayProgress;
  }, [displayProgress]);

  useEffect(() => {
    artists.forEach((artist) => {
      const img = new window.Image();
      img.src = artist.imageUrl;
    });
  }, [artists]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateLayout = () => {
      const vw = window.innerWidth;
      const sw = stage.getBoundingClientRect().width || vw;
      const visible = visibleCountForViewport(vw);
      const cardW = cardWidthForViewport(vw);
      setVisibleCount(visible);
      setStepPx(stepForStage(sw, visible, cardW));
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(stage);
    window.addEventListener("resize", updateLayout, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const target = targetProgressRef.current;
      let display = displayProgressRef.current;
      const delta = target - display;

      if (Math.abs(delta) > 0.0004) {
        display += delta * PROGRESS_LERP;
        displayProgressRef.current = display;
        setDisplayProgress(display);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count === 0) return;

    lastScrollYRef.current = window.scrollY;

    const nudge = (delta: number) => {
      if (delta === 0) return;
      targetProgressRef.current += delta;
    };

    const onPageScroll = () => {
      const dy = window.scrollY - lastScrollYRef.current;
      lastScrollYRef.current = window.scrollY;
      if (dy === 0 || !sectionInView(section)) return;
      nudge(dy * 0.012);
    };

    const onWheel = (event: WheelEvent) => {
      if (!sectionInView(section)) return;
      nudge(event.deltaY * 0.0035);
    };

    window.addEventListener("scroll", onPageScroll, { passive: true });
    section.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", onPageScroll);
      section.removeEventListener("wheel", onWheel);
    };
  }, [count]);

  const virtualCards = useMemo(() => {
    const half = Math.floor(visibleCount / 2);
    const buffer = 2;
    const base = Math.floor(displayProgress);
    const start = base - half - buffer;
    const end = base + half + buffer;
    const list: { virtualIndex: number; artistIndex: number }[] = [];

    for (let virtualIndex = start; virtualIndex <= end; virtualIndex += 1) {
      list.push({
        virtualIndex,
        artistIndex: mod(virtualIndex, count),
      });
    }
    return list;
  }, [visibleCount, displayProgress, count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-hidden border-y border-border bg-bg py-12 md:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_58%,color-mix(in_srgb,var(--vybe-accent)_16%,transparent),transparent_72%)]"
      />

      <Container className="relative z-10">
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <p className="mt-2 text-[28px] font-extrabold tracking-tight text-text uppercase md:text-[36px]">
            Featured acts
          </p>
          <p className="mt-2 max-w-lg text-[14px] text-text-secondary md:text-[15px]">
            Highlight acts playing near you — book concerts and live nights in
            one flow.
          </p>
        </div>
      </Container>

      <div className="relative z-10 w-full overflow-visible pt-6 pb-4 sm:pt-8 md:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-center justify-center px-3 sm:px-6"
          style={{ height: "clamp(500px, 52vw, 580px)" }}
        >
          <div className="-translate-y-4 flex w-full max-w-[98vw] flex-col items-center text-center sm:-translate-y-6 md:-translate-y-8">
            <span
              className="select-none whitespace-nowrap font-black uppercase leading-none tracking-[-0.03em] bg-gradient-to-r from-accent/80 via-accent/55 to-text/30 bg-clip-text text-transparent dark:from-accent/90 dark:via-accent/60 dark:to-white/25"
              style={{
                fontSize: "clamp(4rem, 19vw, 13.5rem)",
                paddingTop: "0.06em",
              }}
            >
              Artists on
            </span>
            <span
              className="select-none whitespace-nowrap font-black uppercase leading-none tracking-[-0.04em] bg-gradient-to-r from-accent via-accent/70 to-text/35 bg-clip-text text-transparent dark:from-accent dark:via-accent/75 dark:to-white/30"
              style={{
                fontSize: "clamp(5rem, 27vw, 26rem)",
                marginTop: "clamp(0.1rem, 0.6vw, 0.35rem)",
              }}
            >
              VYBE
            </span>
          </div>
        </div>
        <div
          ref={stageRef}
          className="relative h-[500px] w-full overflow-hidden sm:h-[520px] md:h-[540px]"
        >
          {virtualCards.map(({ virtualIndex, artistIndex }) => {
            const centerDist = Math.abs(virtualIndex - displayProgress);
            const eager = centerDist < visibleCount;

            return (
              <div
                key={virtualIndex}
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={virtualTransform(
                  virtualIndex,
                  artistIndex,
                  stepPx,
                  displayProgress,
                )}
              >
                <ArtistShowcaseCard
                  artist={artists[artistIndex]}
                  eager={eager}
                />
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
