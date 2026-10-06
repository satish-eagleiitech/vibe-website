import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import type { LiveEvent } from "@/types/event";

type EventHeroCarouselProps = {
  events: LiveEvent[];
};

type GridTile = {
  src: string;
  alt: string;
  href: string;
  height: string;
};

function buildTiles(events: LiveEvent[]): GridTile[] {
  const withImages = events.filter((event) => event.imageUrl);
  const heights = [
    "h-[220px] md:h-[260px]",
    "h-[160px] md:h-[180px]",
    "h-[140px] md:h-[160px]",
    "h-[120px] md:h-[140px]",
    "h-[150px] md:h-[170px]",
    "h-[200px] md:h-[240px]",
    "h-[180px] md:h-[210px]",
  ];

  return Array.from({ length: 7 }, (_, index) => {
    const event = withImages[index % Math.max(withImages.length, 1)];
    return {
      src: event?.imageUrl || "/images/events/event-1.jpg",
      alt: event?.title || "Event on VYBE",
      href: event ? `/events/${event.id}` : "/events#all-events",
      height: heights[index],
    };
  });
}

/**
 * Split hero — same layout in light + dark; theme tokens only (no extra chrome).
 */
export function EventHeroCarousel({ events }: EventHeroCarouselProps) {
  const tiles = buildTiles(events);
  const col1 = [tiles[0], tiles[1]];
  const col2 = [tiles[2], tiles[3], tiles[4]];
  const col3 = [tiles[5], tiles[6]];

  return (
    <section className="relative  w-full overflow-hidden bg-bg text-text md:-mt-[100px] dark:bg-[#0b0b0f] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.12)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.22)_0%,transparent_55%),linear-gradient(115deg,#09090b_0%,#121018_48%,#1a0f16_100%)]"
      />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-[1400px] items-center gap-10 px-5 pt-24 pb-12 sm:px-8 md:grid-cols-2 md:gap-8 md:px-10 md:pt-28 md:pb-16 lg:gap-12 lg:px-14 xl:px-16">
        <div className="max-w-[520px]">
          <p className="text-[12px] font-bold tracking-[0.16em] text-accent uppercase">
            Events on VYBE
          </p>
          <h1 className="mt-3 text-[40px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-[48px] md:text-[52px] lg:text-[58px] dark:text-white">
            Event ticketing made simple
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-text-secondary md:text-[16px] md:leading-7 dark:text-white/70">
            Discover concerts, comedy, nightlife, and city experiences near you.
            Fair prices, fast booking, and human support — all the tools you need
            in one VYBE flow.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/events#all-events"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02]"
            >
              <Ticket className="size-5" />
              Explore events
            </Link>
            <Link
              href="/partner-with-us"
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent dark:text-white dark:decoration-white/40"
            >
              Host on VYBE
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:max-w-none">
          <div className="grid grid-cols-3 gap-3 md:gap-3.5">
            <div className="flex flex-col gap-3 pt-8 md:gap-3.5 md:pt-12">
              {col1.map((tile, i) => (
                <HeroTile key={`c1-${i}`} tile={tile} />
              ))}
            </div>
            <div className="flex flex-col gap-3 md:gap-3.5">
              {col2.map((tile, i) => (
                <HeroTile key={`c2-${i}`} tile={tile} />
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-6 md:gap-3.5 md:pt-10">
              {col3.map((tile, i) => (
                <HeroTile key={`c3-${i}`} tile={tile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTile({ tile }: { tile: GridTile }) {
  return (
    <Link
      href={tile.href}
      className={`relative block w-full overflow-hidden rounded-2xl bg-surface-muted ${tile.height} ring-1 ring-border transition-transform duration-500 hover:scale-[1.02] dark:bg-white/5 dark:ring-white/10`}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 30vw, 180px"
        priority
      />
    </Link>
  );
}
