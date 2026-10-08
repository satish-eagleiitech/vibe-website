import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export type MarqueeHeroTile = {
  src: string;
  alt: string;
  href: string;
};

type MarqueeHeroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  primary: { href: string; label: string; icon: ReactNode };
  secondary?: { href: string; label: string };
  tiles: MarqueeHeroTile[];
};

type GridTile = MarqueeHeroTile & { height: string };

const COLUMN_HEIGHTS = [
  ["h-[200px] md:h-[240px]", "h-[150px] md:h-[170px]", "h-[180px] md:h-[210px]", "h-[140px] md:h-[160px]"],
  ["h-[150px] md:h-[170px]", "h-[190px] md:h-[220px]", "h-[140px] md:h-[160px]", "h-[170px] md:h-[200px]"],
  ["h-[180px] md:h-[210px]", "h-[140px] md:h-[160px]", "h-[200px] md:h-[240px]", "h-[150px] md:h-[170px]"],
];

function buildColumns(tiles: MarqueeHeroTile[]): GridTile[][] {
  return COLUMN_HEIGHTS.map((heights, column) =>
    heights.map((height, index) => ({
      ...tiles[(index * 3 + column) % tiles.length],
      height,
    })),
  );
}

export function MarqueeHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  tiles,
}: MarqueeHeroProps) {
  const [col1, col2, col3] = buildColumns(tiles);

  return (
    <section className="relative w-full overflow-hidden bg-bg text-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.12)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.22)_0%,transparent_55%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 pt-10 pb-12 sm:px-8 md:grid-cols-2 md:gap-8 md:px-10 md:pt-14 md:pb-16 lg:gap-12 lg:px-14 xl:px-16">
        <div className="max-w-[520px]">
          <p className="text-[12px] font-bold tracking-[0.16em] text-accent uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[40px] leading-[1.05] font-extrabold tracking-tight text-text sm:text-[48px] md:text-[52px] lg:text-[58px]">
            {title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-text-secondary md:text-[16px]">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={primary.href}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02]"
            >
              {primary.icon}
              {primary.label}
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-1.5 text-[15px] font-bold text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {secondary.label}
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:max-w-none">
          <div className="grid h-[420px] grid-cols-3 gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] md:h-[520px] md:gap-3.5">
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
          <Link
            key={`${direction}-${tile.src}-${index}`}
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
        ))}
      </div>
    </div>
  );
}
