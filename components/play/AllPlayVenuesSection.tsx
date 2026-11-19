"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ListingFilterModal } from "@/components/common/ListingFilterModal";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { matchesPlaySport, playSports } from "@/lib/data/playSports";
import type { PlayItem } from "@/types/play";

type AllPlayVenuesSectionProps = {
  venues: PlayItem[];
  sport?: string;
  near?: string;
};

const QUICK_SPORTS = playSports.slice(0, 4);

export function AllPlayVenuesSection({
  venues,
  sport: sportProp = "",
  near: nearProp = "",
}: AllPlayVenuesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sport, setSport] = useState(sportProp);
  const [near, setNear] = useState(nearProp);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setSport(searchParams.get("sport") ?? sportProp ?? "");
    setNear(searchParams.get("near") ?? nearProp ?? "");
  }, [searchParams, sportProp, nearProp]);

  const filtered = useMemo(() => {
    return venues.filter((item) => {
      if (!matchesPlaySport(item, sport || undefined)) return false;
      if (near === "5km" && (item.distanceKm ?? 99) > 5) return false;
      return true;
    });
  }, [venues, sport, near]);

  function syncUrl(nextSport: string, nextNear: string) {
    const params = new URLSearchParams();
    if (nextSport) params.set("sport", nextSport);
    if (nextNear) params.set("near", nextNear);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}#all-venues` : `${pathname}#all-venues`, {
      scroll: false,
    });
  }

  function selectSport(id: string) {
    const next = sport === id ? "" : id;
    setSport(next);
    syncUrl(next, near);
  }

  function toggleNear() {
    const next = near === "5km" ? "" : "5km";
    setNear(next);
    syncUrl(sport, next);
  }

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  const filterActive = Boolean(sport || near);

  return (
    <section
      id="all-venues"
      className="scroll-mt-[var(--vybe-header-h)] w-full overflow-x-clip pt-3 md:pt-6 lg:pt-10"
    >
      <Container>
        <div className="mb-5 md:mb-6">
          <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
            All Sports Venues
          </h2>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            Courts, turf and game time near you
          </p>
        </div>
      </Container>

      <StickyFilterBar pinToViewport>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[12px] font-bold transition-colors ${
            filterActive
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-surface text-text hover:border-accent/40"
          }`}
        >
          <SlidersHorizontal className="size-3" />
          Filters
          <ChevronDown className="size-3 opacity-70" />
        </button>

        <button type="button" onClick={toggleNear} className={chipClass(near === "5km")}>
          Under 5 km
        </button>

        {QUICK_SPORTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectSport(item.id)}
            className={chipClass(sport === item.id)}
          >
            {item.label}
          </button>
        ))}
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

      <ListingFilterModal
        open={filterOpen}
        values={{ sport }}
        panels={[
          {
            id: "sport",
            label: "Sport",
            options: playSports.map((item) => ({ id: item.id, label: item.label })),
          },
        ]}
        onClose={() => setFilterOpen(false)}
        onClear={() => {
          setSport("");
          syncUrl("", near);
        }}
        onApply={(values) => {
          const nextSport = values.sport ?? "";
          setSport(nextSport);
          syncUrl(nextSport, near);
        }}
      />
    </section>
  );
}
