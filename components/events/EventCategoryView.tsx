"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/common/Container";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { EventListingCard } from "@/components/events/EventListingCard";
import { EventSubcategoryGrid } from "@/components/events/EventSubcategoryGrid";
import type { EventExploreCategory } from "@/lib/data/eventCategories";
import type { LiveEvent } from "@/types/event";

type EventCategoryViewProps = {
  category: EventExploreCategory;
  categories: EventExploreCategory[];
  events: LiveEvent[];
  city?: string;
};

export function EventCategoryView({
  category,
  categories,
  events,
  city = "Hyderabad",
}: EventCategoryViewProps) {
  const chip =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors";
  const chipIdle = "border-border bg-surface text-text hover:border-accent/40";
  const chipOn = "border-accent bg-accent-soft text-accent";

  return (
    <div className="w-full pb-14">
      <Container className="pt-6 md:pt-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-[13px] font-bold text-text-secondary transition-colors hover:text-accent"
        >
          <ChevronLeft className="size-4" />
          Events
        </Link>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-text md:text-[32px]">
          {category.label} in {city}
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          {category.subcategories.length}{" "}
          {category.subcategories.length === 1 ? "type" : "types"} to explore
        </p>
      </Container>

      <section className="mt-5 w-full overflow-x-clip scroll-mt-[var(--vybe-header-h)]">
        <StickyFilterBar pinToViewport containerClassName="gap-2 py-3">
          {categories.map((entry) => {
            const current = entry.id === category.id;
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
          <EventSubcategoryGrid
            items={category.subcategories}
            title={`${category.label} types`}
            meta={category.label}
          />

          <h2 className="mt-10 text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
            Events
          </h2>
          {events.length === 0 ? (
            <p className="mt-4 text-[14px] text-text-secondary">No events in this category yet.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
              {events.map((event) => (
                <EventListingCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
