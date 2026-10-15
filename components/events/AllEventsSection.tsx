"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import { EventListingCard } from "@/components/events/EventListingCard";
import type { LiveEvent } from "@/types/event";

type EventFiltersBarProps = {
  events: LiveEvent[];
  category?: string;
  when?: string;
};

const WHEN_FILTERS = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
] as const;

const QUICK_CATEGORIES = ["Music", "Nightlife", "Comedy"] as const;

function matchesCategory(event: LiveEvent, category?: string) {
  if (!category) return true;
  const needle = category.toLowerCase();
  const hay = `${event.category} ${event.title}`.toLowerCase();
  if (needle === "music") return /music|concert|live|indie|rock|jazz|folk|dj/.test(hay);
  if (needle === "nightlife") return /night|club|dj|skyline/.test(hay);
  if (needle === "comedy") return /comedy|standup|comic/.test(hay);
  if (needle === "food") return /food|taste|dining|brunch/.test(hay);
  if (needle === "sports") return /sport|arena|match/.test(hay);
  if (needle === "performances") return /theatre|performance|play|black box/.test(hay);
  if (needle === "social") return /social|mixer|jam/.test(hay);
  if (needle === "screenings") return /screen|film|cinema|score/.test(hay);
  if (needle === "fitness") return /fitness|yoga|run/.test(hay);
  if (needle === "expos") return /expo|exhibition|hitex|convention/.test(hay);
  if (needle === "art") return /art|gallery|poetry|exhibition/.test(hay);
  if (needle === "fests") return /fest|fair|carnival|yard/.test(hay);
  if (needle === "romantic") return /romantic|candle|date|palace/.test(hay);
  if (needle === "chill") return /chill|lounge|jazz|acoustic|candle/.test(hay);
  if (needle === "family") return /family|kids|fair|festival/.test(hay);
  return hay.includes(needle);
}

export function AllEventsSection({
  events,
  category,
  when,
}: EventFiltersBarProps) {
  const filtered = useMemo(() => {
    return events.filter((event) => matchesCategory(event, category));
  }, [events, category]);

  function hrefFor(next: { category?: string; when?: string }) {
    const params = new URLSearchParams();
    const cat = "category" in next ? next.category : category;
    const w = "when" in next ? next.when : when;
    if (cat) params.set("category", cat);
    if (w) params.set("when", w);
    const qs = params.toString();
    return qs ? `/events?${qs}#all-events` : "/events#all-events";
  }

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  return (
    <section
      id="all-events"
      className="scroll-mt-[var(--vybe-header-h)] w-full overflow-x-clip pt-8 md:pt-10"
    >
      <Container>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-6">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
              All Events
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              Live nights worth going out for
            </p>
          </div>
          <p className="text-[14px] font-semibold text-text-muted">
            {filtered.length} {filtered.length === 1 ? "event" : "events"}
          </p>
        </div>
      </Container>

      <StickyFilterBar>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[12px] font-bold text-text">
          <SlidersHorizontal className="size-3" />
          Filters
          <ChevronDown className="size-3 text-text-muted" />
        </span>

        {WHEN_FILTERS.map((item) => {
          const selected = when === item.id;
          return (
            <Link
              key={item.id}
              href={hrefFor({ when: selected ? "" : item.id })}
              scroll={false}
              className={chipClass(selected)}
            >
              {item.label}
            </Link>
          );
        })}

        <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-text-secondary">
          Under 10 km
        </span>

        {QUICK_CATEGORIES.map((label) => {
          const selected = (category || "").toLowerCase() === label.toLowerCase();
          return (
            <Link
              key={label}
              href={hrefFor({ category: selected ? "" : label })}
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
          <EmptyState title="No events for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-7 3xl:grid-cols-6 4xl:grid-cols-7">
            {filtered.map((event) => (
              <EventListingCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
