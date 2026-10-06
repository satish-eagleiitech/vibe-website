"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { DiningCard } from "@/components/dining/DiningCard";
import { diningMoods, matchesDiningMood } from "@/lib/data/diningMoods";
import type { DiningSpot } from "@/types/dining";

type AllDiningSectionProps = {
  spots: DiningSpot[];
  mood?: string;
  cuisine?: string;
  area?: string;
  price?: string;
};

const AREA_FILTERS = [
  "Jubilee Hills",
  "Banjara Hills",
  "Madhapur",
  "Gachibowli",
  "Hitech City",
] as const;

const PRICE_FILTERS = [
  { id: "rr", label: "₹₹" },
  { id: "rrr", label: "₹₹₹" },
] as const;

function matchesPrice(spot: DiningSpot, price?: string) {
  if (!price) return true;
  if (price === "rr") return spot.priceRange === "₹₹";
  if (price === "rrr") return spot.priceRange === "₹₹₹";
  return true;
}

export function AllDiningSection({
  spots,
  mood,
  cuisine,
  area,
  price,
}: AllDiningSectionProps) {
  const filtered = useMemo(() => {
    return spots.filter((spot) => {
      const cuisineId = cuisine || mood;
      if (cuisineId && !matchesDiningMood(spot, cuisineId)) return false;
      if (area && spot.locality !== area) return false;
      if (!matchesPrice(spot, price)) return false;
      return true;
    });
  }, [spots, mood, cuisine, area, price]);

  function hrefFor(next: {
    cuisine?: string;
    area?: string;
    price?: string;
  }) {
    const params = new URLSearchParams();
    const nextCuisine = "cuisine" in next ? next.cuisine : cuisine;
    const nextArea = "area" in next ? next.area : area;
    const nextPrice = "price" in next ? next.price : price;
    if (mood && !nextCuisine) params.set("mood", mood);
    if (nextCuisine) params.set("cuisine", nextCuisine);
    if (nextArea) params.set("area", nextArea);
    if (nextPrice) params.set("price", nextPrice);
    const qs = params.toString();
    return qs ? `/dining?${qs}#all-restaurants` : "/dining#all-restaurants";
  }

  return (
    <section
      id="all-restaurants"
      className="scroll-mt-[var(--vybe-header-h)] w-full py-8 md:py-10"
    >
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          All restaurants
        </h2>
      </Container>

      <StickyFilterBar className="mt-4">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-text">
            <SlidersHorizontal className="size-3.5" />
            Filters
            <ChevronDown className="size-3.5 text-text-muted" />
          </span>

          {diningMoods.slice(0, 5).map((item) => {
            const selected = (cuisine || mood) === item.id;
            return (
              <Link
                key={item.id}
                href={hrefFor({ cuisine: selected ? "" : item.id })}
                scroll={false}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-text hover:border-accent/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {AREA_FILTERS.map((label) => {
            const selected = area === label;
            return (
              <Link
                key={label}
                href={hrefFor({ area: selected ? "" : label })}
                scroll={false}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-text hover:border-accent/40"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {PRICE_FILTERS.map((item) => {
            const selected = price === item.id;
            return (
              <Link
                key={item.id}
                href={hrefFor({ price: selected ? "" : item.id })}
                scroll={false}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface text-text hover:border-accent/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <span className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-text-secondary">
            Under 10 km
          </span>
      </StickyFilterBar>

      <Container className="mt-7">
        {filtered.length === 0 ? (
          <EmptyState title="No restaurants for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
            {filtered.map((spot) => (
              <DiningCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
