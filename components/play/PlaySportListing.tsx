"use client";

import Link from "next/link";
import { Check, ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { playSports } from "@/lib/data/playSports";
import type { PlayItem, PlaySport } from "@/types/play";

type SortId = "relevance" | "distance" | "rating" | "price-asc" | "price-desc";

const SORTS: { id: SortId; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "distance", label: "Distance: nearest first" },
  { id: "rating", label: "Rating: high to low" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const NEAR_KM = 5;

type PlaySportListingProps = {
  sport: PlaySport;
  venues: PlayItem[];
  city?: string;
};

function sortVenues(venues: PlayItem[], sort: SortId) {
  const list = [...venues];
  const far = Number.POSITIVE_INFINITY;
  if (sort === "distance") list.sort((a, b) => (a.distanceKm ?? far) - (b.distanceKm ?? far));
  if (sort === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  if (sort === "price-asc") list.sort((a, b) => (a.price ?? far) - (b.price ?? far));
  if (sort === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return list;
}

export function PlaySportListing({ sport, venues, city = "Hyderabad" }: PlaySportListingProps) {
  const [sort, setSort] = useState<SortId>("relevance");
  const [nearOnly, setNearOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) setFiltersOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  const visible = useMemo(() => {
    const scoped = nearOnly
      ? venues.filter((venue) => (venue.distanceKm ?? Infinity) <= NEAR_KM)
      : venues;
    return sortVenues(scoped, sort);
  }, [venues, sort, nearOnly]);

  const sortActive = sort !== "relevance";
  const chip =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors";
  const chipIdle = "border-border bg-surface text-text hover:border-accent/40";
  const chipOn = "border-accent bg-accent-soft text-accent";

  return (
    <div className="w-full pb-14">
      <Container className="pt-6 md:pt-8">
        <Link
          href="/play"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-text-secondary transition-colors hover:text-accent"
        >
          <ChevronLeft className="size-4" />
          Play
        </Link>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-text md:text-[32px]">
          {sport.listingTitle} in {city}
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          {venues.length} {venues.length === 1 ? "venue" : "venues"} to book for {sport.label.toLowerCase()}
        </p>
      </Container>

      <div className="sticky top-(--vybe-header-h) z-30 mt-5 border-b border-border bg-bg/95 backdrop-blur-xl">
        <Container className="flex items-center gap-2 py-3">
          <div ref={filtersRef} className="relative shrink-0">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className={`${chip} ${sortActive ? chipOn : chipIdle}`}
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
              <ChevronDown
                className={`size-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""} ${
                  sortActive ? "" : "text-text-muted"
                }`}
              />
            </button>
            {filtersOpen ? (
              <div className="absolute top-[calc(100%+8px)] left-0 z-40 w-[248px] overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[0_18px_40px_rgba(17,24,39,0.14)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
                <p className="px-3 pt-2 pb-1.5 text-[11px] font-extrabold tracking-[0.14em] text-text-muted uppercase">
                  Sort by
                </p>
                {SORTS.map((option) => {
                  const selected = option.id === sort;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSort(option.id);
                        setFiltersOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                        selected ? "bg-accent-soft text-accent" : "text-text hover:bg-surface-muted"
                      }`}
                    >
                      {option.label}
                      {selected ? <Check className="size-4" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            aria-pressed={nearOnly}
            onClick={() => setNearOnly((value) => !value)}
            className={`${chip} ${nearOnly ? chipOn : chipIdle}`}
          >
            Under {NEAR_KM} km
          </button>

          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />

          <div className="hide-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {playSports.map((entry) => {
              const current = entry.id === sport.id;
              return (
                <Link
                  key={entry.id}
                  href={entry.href}
                  aria-current={current ? "page" : undefined}
                  className={`${chip} ${current ? chipOn : chipIdle}`}
                >
                  {entry.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="mt-6">
        {visible.length === 0 ? (
          <EmptyState
            title={
              nearOnly
                ? `No ${sport.label.toLowerCase()} venues within ${NEAR_KM} km`
                : `No ${sport.label.toLowerCase()} venues yet`
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((venue) => (
              <PlayVenueCard key={venue.id} item={venue} variant="browse" />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
