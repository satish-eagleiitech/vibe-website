"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ListingFilterModal } from "@/components/common/ListingFilterModal";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { playSports } from "@/lib/data/playSports";
import type { PlayItem, PlaySport } from "@/types/play";

const NEAR_KM = 5;
const QUICK_SPORTS = playSports.slice(0, 4);

type PlaySportListingProps = {
  sport: PlaySport;
  venues: PlayItem[];
  city?: string;
};

export function PlaySportListing({ sport, venues, city = "Hyderabad" }: PlaySportListingProps) {
  const router = useRouter();
  const [nearOnly, setNearOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const visible = useMemo(() => {
    if (!nearOnly) return venues;
    return venues.filter((venue) => (venue.distanceKm ?? Infinity) <= NEAR_KM);
  }, [venues, nearOnly]);

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
          Book {sport.label.toLowerCase()} near you
        </p>
      </Container>

      <section className="mt-5 w-full overflow-x-clip scroll-mt-[var(--vybe-header-h)]">
        <StickyFilterBar pinToViewport containerClassName="gap-2 py-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`${chip} ${chipIdle}`}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
            <ChevronDown className="size-3.5 opacity-70" />
          </button>

          <button
            type="button"
            aria-pressed={nearOnly}
            onClick={() => setNearOnly((value) => !value)}
            className={`${chip} ${nearOnly ? chipOn : chipIdle}`}
          >
            Under {NEAR_KM} km
          </button>

          <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />

          {QUICK_SPORTS.map((entry) => {
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
        </StickyFilterBar>

        <Container className="pt-6 pb-10 md:pt-8 md:pb-12">
          {visible.length === 0 ? (
            <EmptyState
              title={
                nearOnly
                  ? `No ${sport.label.toLowerCase()} venues within ${NEAR_KM} km`
                  : `No ${sport.label.toLowerCase()} venues yet`
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
              {visible.map((venue) => (
                <PlayVenueCard key={venue.id} item={venue} variant="browse" />
              ))}
            </div>
          )}
        </Container>
      </section>

      <ListingFilterModal
        open={filterOpen}
        values={{ sport: sport.id }}
        panels={[
          {
            id: "sport",
            label: "Sport",
            options: playSports.map((item) => ({ id: item.id, label: item.label })),
          },
        ]}
        onClose={() => setFilterOpen(false)}
        onClear={() => {
          router.push("/play#all-venues");
        }}
        onApply={(values) => {
          const nextSport = playSports.find((item) => item.id === values.sport);
          if (nextSport && nextSport.id !== sport.id) {
            router.push(nextSport.href);
          }
        }}
      />
    </div>
  );
}
