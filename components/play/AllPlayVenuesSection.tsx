"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { matchesPlaySport, playSports } from "@/lib/data/playSports";
import type { PlayItem } from "@/types/play";

type AllPlayVenuesSectionProps = {
  venues: PlayItem[];
  sport?: string;
  near?: string;
};

const QUICK_SPORTS = [
  "badminton",
  "box-cricket",
  "pickleball",
  "turf-football",
] as const;

export function AllPlayVenuesSection({
  venues,
  sport,
  near,
}: AllPlayVenuesSectionProps) {
  const filtered = useMemo(() => {
    return venues.filter((item) => {
      if (!matchesPlaySport(item, sport)) return false;
      if (near === "5km" && (item.distanceKm ?? 99) > 5) return false;
      return true;
    });
  }, [venues, sport, near]);

  function hrefFor(next: { sport?: string; near?: string }) {
    const params = new URLSearchParams();
    const nextSport = "sport" in next ? next.sport : sport;
    const nextNear = "near" in next ? next.near : near;
    if (nextSport) params.set("sport", nextSport);
    if (nextNear) params.set("near", nextNear);
    const qs = params.toString();
    return qs ? `/play?${qs}#all-venues` : "/play#all-venues";
  }

  return (
    <section id="all-venues" className="scroll-mt-[var(--vybe-header-h)] w-full py-8 md:py-10">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          All Sports Venues
        </h2>
      </Container>

      <StickyFilterBar className="mt-4">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-text">
            <SlidersHorizontal className="size-3.5" />
            Filters
            <ChevronDown className="size-3.5 text-text-muted" />
          </span>

          <Link
            href={hrefFor({ near: near === "5km" ? "" : "5km" })}
            scroll={false}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold ${
              near === "5km"
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface text-text hover:border-accent/40"
            }`}
          >
            Under 5 km
          </Link>

          {QUICK_SPORTS.map((id) => {
            const label =
              playSports.find((item) => item.id === id)?.label ?? id;
            const selected = sport === id;
            return (
              <Link
                key={id}
                href={hrefFor({ sport: selected ? "" : id })}
                scroll={false}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold ${
                  selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-text hover:border-accent/40"
                }`}
              >
                {label}
              </Link>
            );
          })}
      </StickyFilterBar>

      <Container className="mt-7">
        {filtered.length === 0 ? (
          <EmptyState title="No venues for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((item) => (
              <PlayVenueCard key={item.id} item={item} variant="browse" />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
