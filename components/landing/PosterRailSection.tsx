"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { RailPager, useRailPager } from "@/components/common/RailPager";
import type { LandingPosterCard } from "@/lib/data/landingExtras";
import { trackRecentView } from "@/lib/recent/storage";

/** Match `DiningCarousel` card slots and scroller */
const RAIL_CARD_SLOT =
  "w-[46%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)]";

type PosterRailSectionProps = {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  items: LandingPosterCard[];
};

function recentCategory(href: string) {
  if (href.includes("/dining")) return "dining" as const;
  if (href.includes("/play")) return "play" as const;
  if (href.includes("/activities")) return "activities" as const;
  return "events" as const;
}

function PosterCard({ item }: { item: LandingPosterCard }) {
  const meta = item.venue || item.schedule || "";

  return (
    <Link
      href={item.href}
      onClick={() =>
        trackRecentView({
          id: item.id,
          title: item.title,
          href: item.href,
          imageUrl: item.imageUrl,
          meta,
          category: recentCategory(item.href),
        })
      }
      className="group flex w-full flex-col"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 25vw, 20vw"
        />
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

export function PosterRailSection({
  title,
  description,
  href = "/events",
  linkLabel = "See all",
  items,
}: PosterRailSectionProps) {
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
                <PosterCard item={item} />
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
