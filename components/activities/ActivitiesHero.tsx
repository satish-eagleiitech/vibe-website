import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Activity } from "@/types/activity";

const HEADLINE = [
  { label: "Explore.", href: "/activities#all-activities" },
  {
    label: "Adventure.",
    href: "/activities?category=Adventure#all-activities",
  },
  {
    label: "Create.", href: "/activities?category=Workshop#all-activities" },
  { label: "Book.", href: "/activities#all-activities", accent: true },
] as const;

const FALLBACK_IMAGES = Array.from(
  { length: 12 },
  (_, index) => `/images/activities/activity-${index + 1}.jpg`,
);

/** Six vertical stacks — varied tile heights (SAVEE-style masonry). */
const COLUMN_HEIGHTS: string[][] = [
  [
    "h-[88px] sm:h-[102px] md:h-[112px]",
    "h-[128px] sm:h-[148px] md:h-[164px]",
    "h-[100px] sm:h-[118px] md:h-[130px]",
    "h-[136px] sm:h-[158px] md:h-[172px]",
  ],
  [
    "h-[116px] sm:h-[134px] md:h-[148px]",
    "h-[92px] sm:h-[108px] md:h-[118px]",
    "h-[144px] sm:h-[168px] md:h-[184px]",
    "h-[108px] sm:h-[126px] md:h-[138px]",
  ],
  [
    "h-[104px] sm:h-[122px] md:h-[134px]",
    "h-[140px] sm:h-[162px] md:h-[178px]",
    "h-[96px] sm:h-[112px] md:h-[124px]",
    "h-[132px] sm:h-[152px] md:h-[166px]",
  ],
  [
    "h-[132px] sm:h-[154px] md:h-[168px]",
    "h-[100px] sm:h-[118px] md:h-[128px]",
    "h-[124px] sm:h-[144px] md:h-[158px]",
    "h-[112px] sm:h-[130px] md:h-[142px]",
  ],
  [
    "h-[96px] sm:h-[114px] md:h-[124px]",
    "h-[136px] sm:h-[158px] md:h-[174px]",
    "h-[120px] sm:h-[140px] md:h-[154px]",
    "h-[104px] sm:h-[122px] md:h-[134px]",
  ],
  [
    "h-[124px] sm:h-[144px] md:h-[158px]",
    "h-[108px] sm:h-[126px] md:h-[138px]",
    "h-[92px] sm:h-[108px] md:h-[118px]",
    "h-[148px] sm:h-[172px] md:h-[188px]",
  ],
];

type GridTile = {
  src: string;
  alt: string;
  href: string;
  height: string;
};

function uniqueTiles(activities: Activity[]): Omit<GridTile, "height">[] {
  const seen = new Set<string>();
  const tiles: Omit<GridTile, "height">[] = [];

  for (const activity of activities) {
    if (!activity.imageUrl || seen.has(activity.imageUrl)) continue;
    seen.add(activity.imageUrl);
    tiles.push({
      src: activity.imageUrl,
      alt: activity.title,
      href: `/activities/${activity.id}`,
    });
  }

  for (const src of FALLBACK_IMAGES) {
    if (seen.has(src)) continue;
    seen.add(src);
    tiles.push({
      src,
      alt: "Activity on VYBE",
      href: "/activities#all-activities",
    });
  }

  return tiles;
}

function buildColumns(activities: Activity[]): GridTile[][] {
  const pool = uniqueTiles(activities);
  return COLUMN_HEIGHTS.map((heights, column) =>
    heights.map((height, row) => {
      const tile = pool[(row * 6 + column) % pool.length];
      return { ...tile, height };
    }),
  );
}

type ActivitiesHeroProps = {
  activities: Activity[];
};

export function ActivitiesHero({ activities }: ActivitiesHeroProps) {
  const columns = buildColumns(activities);

  return (
    <section
      aria-labelledby="activities-hero-heading"
      className="relative w-full overflow-hidden bg-bg text-text"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.12)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,rgb(255_0_91_/_0.22)_0%,transparent_55%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-start gap-10 px-5 pt-6 pb-10 sm:px-8 md:grid-cols-[minmax(0,42%)_minmax(0,58%)] md:gap-8 md:px-10 md:pt-10 md:pb-14 lg:gap-10 lg:px-14 xl:px-16">
        <div className="max-w-[520px] md:pt-4">
          <p className="text-[12px] font-bold tracking-[0.16em] text-accent uppercase">
            Activities on VYBE
          </p>
          <h1 id="activities-hero-heading" className="sr-only">
            Explore activities in Hyderabad
          </h1>
          <div className="mt-3">
            {HEADLINE.map((line) => (
              <Link
                key={line.label}
                href={line.href}
                className={`block text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[0.95] tracking-tight ${
                  "accent" in line && line.accent ? "text-accent" : "text-text"
                }`}
              >
                {line.label}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-7 text-text-secondary md:text-[16px]">
            The best day-outs, workshops, and weekend plans — curated for
            Hyderabad.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/activities#all-activities"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)]"
            >
              Browse activities
            </Link>
            <Link
              href="/activities#all-activities"
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-text underline decoration-border underline-offset-4"
            >
              All activities
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="min-w-0 md:justify-self-end md:w-full md:max-w-[720px] lg:max-w-none">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-6 md:gap-2">
            {columns.map((column, columnIndex) => (
              <div
                key={`col-${columnIndex}`}
                className="flex flex-col gap-1.5 sm:gap-2"
              >
                {column.map((tile, rowIndex) => (
                  <Link
                    key={`${columnIndex}-${rowIndex}-${tile.src}`}
                    href={tile.href}
                    className={`relative block w-full shrink-0 overflow-hidden bg-surface-muted ${tile.height}`}
                  >
                    <Image
                      src={tile.src}
                      alt={tile.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 14vw, 100px"
                      priority={columnIndex < 2 && rowIndex === 0}
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
