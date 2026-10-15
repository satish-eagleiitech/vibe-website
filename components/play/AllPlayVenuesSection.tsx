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

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  return (
    <section
      id="all-venues"
      className="scroll-mt-[var(--vybe-header-h)] w-full overflow-x-clip pt-3 md:pt-6 lg:pt-10"
    >
      <Container>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-6">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
              All Sports Venues
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              Courts, turf and game time near you
            </p>
          </div>
          <p className="text-[14px] font-semibold text-text-muted">
            {filtered.length} {filtered.length === 1 ? "venue" : "venues"}
          </p>
        </div>
      </Container>

      <StickyFilterBar>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[12px] font-bold text-text">
          <SlidersHorizontal className="size-3" />
          Filters
          <ChevronDown className="size-3 text-text-muted" />
        </span>

        <Link
          href={hrefFor({ near: near === "5km" ? "" : "5km" })}
          scroll={false}
          className={chipClass(near === "5km")}
        >
          Under 5 km
        </Link>

        {QUICK_SPORTS.map((id) => {
          const label = playSports.find((item) => item.id === id)?.label ?? id;
          const selected = sport === id;
          return (
            <Link
              key={id}
              href={hrefFor({ sport: selected ? "" : id })}
              scroll={false}
              className={chipClass(selected)}
            >
              {label}
            </Link>
          );
        })}
      </StickyFilterBar>

      <Container className="pt-6 pb-10 md:pt-8 md:pb-12">
        {filtered.length === 0 ? (
          <EmptyState title="No venues for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
            {filtered.map((item) => (
              <PlayVenueCard key={item.id} item={item} variant="browse" />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
