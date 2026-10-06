import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import type { DiningSpot } from "@/types/dining";

type DiningHeroProps = {
  spots: DiningSpot[];
};

type GridTile = {
  src: string;
  alt: string;
  href: string;
  height: string;
};

const FALLBACK_IMAGES = Array.from(
  { length: 12 },
  (_, index) => `/images/dining/dining-${index + 1}.jpg`,
);

const COLUMN_HEIGHTS = [
  ["h-[200px] md:h-[240px]", "h-[150px] md:h-[170px]", "h-[180px] md:h-[210px]", "h-[140px] md:h-[160px]"],
  ["h-[150px] md:h-[170px]", "h-[190px] md:h-[220px]", "h-[140px] md:h-[160px]", "h-[170px] md:h-[200px]"],
  ["h-[180px] md:h-[210px]", "h-[140px] md:h-[160px]", "h-[200px] md:h-[240px]", "h-[150px] md:h-[170px]"],
];

function uniqueTiles(spots: DiningSpot[]): Omit<GridTile, "height">[] {
  const seen = new Set<string>();
  const tiles: Omit<GridTile, "height">[] = [];

  for (const spot of spots) {
    if (!spot.imageUrl || seen.has(spot.imageUrl)) continue;
    seen.add(spot.imageUrl);
    tiles.push({
      src: spot.imageUrl,
      alt: spot.name,
      href: `/dining/${spot.id}`,
    });
  }

  for (const src of FALLBACK_IMAGES) {
    if (seen.has(src)) continue;
    seen.add(src);
    tiles.push({
      src,
      alt: "Dining on VYBE",
      href: "/dining#all-restaurants",
    });
  }

  return tiles;
}

function buildColumns(spots: DiningSpot[]): GridTile[][] {
  const pool = uniqueTiles(spots);
  return COLUMN_HEIGHTS.map((heights, column) =>
    heights.map((height, index) => {
      const tile = pool[(index * 3 + column) % pool.length];
      return { ...tile, height };
    }),
  );
}

export function DiningHero({ spots }: DiningHeroProps) {
  const [col1, col2, col3] = buildColumns(spots);

  return (
    <section className="relative w-full overflow-hidden bg-bg text-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.12)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.22)_0%,transparent_55%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 pt-10 pb-12 sm:px-8 md:grid-cols-2 md:gap-8 md:px-10 md:pt-14 md:pb-16 lg:gap-12 lg:px-14 xl:px-16">
        <div className="max-w-[520px]">
          <p className="text-[12px] font-bold tracking-[0.16em] text-accent uppercase">
            Dining on VYBE
          </p>
          <h1 className="mt-3 text-[40px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-[48px] md:text-[52px] lg:text-[58px]">
            Tables worth booking
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-text-secondary md:text-[16px]">
            Reserve a table at Hyderabad&apos;s most-loved restaurants — cafes,
            grills, rooftops, and late-night kitchens in one flow.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dining#all-restaurants"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02]"
            >
              <UtensilsCrossed className="size-5" />
              Browse restaurants
            </Link>
            <Link
              href="/dining#mood-section"
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Pick a mood
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:max-w-none">
          <div className="grid h-[420px] grid-cols-3 gap-3 overflow-hidden md:h-[520px] md:gap-3.5 [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
            <MarqueeColumn tiles={col1} direction="down" duration="26s" />
            <MarqueeColumn tiles={col2} direction="up" duration="34s" />
            <MarqueeColumn tiles={col3} direction="down" duration="30s" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeColumn({
  tiles,
  direction,
  duration,
}: {
  tiles: GridTile[];
  direction: "up" | "down";
  duration: string;
}) {
  const loop = [...tiles, ...tiles];

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-3 md:gap-3.5 ${direction === "up" ? "vybe-marquee-up" : "vybe-marquee-down"} hover:[animation-play-state:paused]`}
        style={{ ["--vybe-marquee-duration" as string]: duration }}
      >
        {loop.map((tile, index) => (
          <HeroTile key={`${direction}-${tile.src}-${index}`} tile={tile} />
        ))}
      </div>
    </div>
  );
}

function HeroTile({ tile }: { tile: GridTile }) {
  return (
    <Link
      href={tile.href}
      className={`relative block w-full shrink-0 overflow-hidden rounded-2xl bg-surface-muted ${tile.height} ring-1 ring-border transition-transform duration-500 hover:scale-[1.02]`}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 30vw, 180px"
      />
    </Link>
  );
}
