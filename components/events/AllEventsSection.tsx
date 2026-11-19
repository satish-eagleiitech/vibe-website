"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ListingFilterModal } from "@/components/common/ListingFilterModal";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { EventListingCard } from "@/components/events/EventListingCard";
import {
  eventExploreCategories,
  filterEvents,
  findEventCategory,
} from "@/lib/data/eventCategories";
import type { LiveEvent } from "@/types/event";

type AllEventsSectionProps = {
  events: LiveEvent[];
  category?: string;
  when?: string;
};

const WHEN_FILTERS = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
] as const;

const ALL_CATEGORIES = eventExploreCategories.map((category) => ({
  id: category.id,
  label: category.label,
}));

/** Short chip row — rest live in the Filters modal */
const QUICK_CATEGORIES = ALL_CATEGORIES.slice(0, 4);

export function AllEventsSection({
  events,
  category: categoryProp = "",
  when: whenProp = "",
}: AllEventsSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(categoryProp);
  const [when, setWhen] = useState(whenProp);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get("category") ?? categoryProp ?? "");
    setWhen(searchParams.get("when") ?? whenProp ?? "");
  }, [searchParams, categoryProp, whenProp]);

  const categoryKey = findEventCategory(category)?.id ?? category;

  const uniqueEvents = useMemo(() => {
    const filtered = filterEvents(events, { category: categoryKey, when });
    const seen = new Set<string>();
    return filtered.filter((event) => {
      if (seen.has(event.id)) return false;
      seen.add(event.id);
      return true;
    });
  }, [events, categoryKey, when]);

  function syncUrl(nextCategory: string, nextWhen: string) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextWhen) params.set("when", nextWhen);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}#all-events` : `${pathname}#all-events`, {
      scroll: false,
    });
  }

  function selectCategory(id: string) {
    const next = categoryKey === id ? "" : id;
    setCategory(next);
    syncUrl(next, when);
  }

  function selectWhen(id: string) {
    const next = when === id ? "" : id;
    setWhen(next);
    syncUrl(categoryKey, next);
  }

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  const filterActive = Boolean(categoryKey || when);

  return (
    <section
      id="all-events"
      className="scroll-mt-[var(--vybe-header-h)] w-full overflow-x-clip pt-3 md:pt-6 lg:pt-10"
    >
      <Container>
        <div className="mb-5 md:mb-6">
          <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
            All Events
          </h2>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            Live nights worth going out for
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

        {WHEN_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectWhen(item.id)}
            className={chipClass(when === item.id)}
          >
            {item.label}
          </button>
        ))}

        <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-text-secondary">
          Under 10 km
        </span>

        {QUICK_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectCategory(item.id)}
            className={chipClass(categoryKey === item.id)}
          >
            {item.label}
          </button>
        ))}
      </StickyFilterBar>

      <Container className="pt-6 pb-10 md:pt-8 md:pb-12">
        {uniqueEvents.length === 0 ? (
          <EmptyState title="No events for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
            {uniqueEvents.map((event) => (
              <EventListingCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>

      <ListingFilterModal
        open={filterOpen}
        values={{ category: categoryKey }}
        panels={[
          {
            id: "category",
            label: "Category",
            options: ALL_CATEGORIES,
          },
        ]}
        onClose={() => setFilterOpen(false)}
        onClear={() => {
          setCategory("");
          syncUrl("", when);
        }}
        onApply={(values) => {
          const nextCategory = values.category ?? "";
          setCategory(nextCategory);
          syncUrl(nextCategory, when);
        }}
      />
    </section>
  );
}
