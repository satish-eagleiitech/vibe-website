"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import type { Activity } from "@/types/activity";

type AllActivitiesSectionProps = {
  activities: Activity[];
  category?: string;
  when?: string;
};

const QUICK_CATEGORIES = [
  "Outdoor",
  "Water",
  "Workshop",
  "Adventure",
  "Indoor",
  "Camping",
] as const;

const WHEN_FILTERS = [
  { id: "weekend", label: "Weekends" },
  { id: "today", label: "Today" },
] as const;

function matchesCategory(activity: Activity, category?: string) {
  if (!category) return true;
  if (category === "top") {
    return activity.price >= 999;
  }
  if (category === "budget") {
    return activity.price <= 599;
  }
  const needle = decodeURIComponent(category).toLowerCase();
  const hay = `${activity.category} ${activity.title} ${activity.venue ?? ""}`.toLowerCase();
  if (needle === "kids") return /kid|family|play/.test(hay);
  if (needle === "fitness") return /fitness|gym|climb|yoga|cycle/.test(hay);
  return (
    activity.category.toLowerCase() === needle ||
    hay.includes(needle.replace(/-/g, " "))
  );
}

function matchesWhen(activity: Activity, when?: string) {
  if (!when) return true;
  const schedule = (activity.schedule ?? "").toLowerCase();
  if (when === "weekend") {
    return /sat|sun|weekend/.test(schedule);
  }
  if (when === "today") {
    return /daily|today|multiple/.test(schedule);
  }
  return true;
}

export function AllActivitiesSection({
  activities,
  category,
  when,
}: AllActivitiesSectionProps) {
  const filtered = useMemo(() => {
    let list = activities.filter(
      (item) => matchesCategory(item, category) && matchesWhen(item, when),
    );
    if (category === "top") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activities, category, when]);

  function hrefFor(next: { category?: string; when?: string }) {
    const params = new URLSearchParams();
    const cat = "category" in next ? next.category : category;
    const w = "when" in next ? next.when : when;
    if (cat) params.set("category", cat);
    if (w) params.set("when", w);
    const qs = params.toString();
    return qs ? `/activities?${qs}#all-activities` : "/activities#all-activities";
  }

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  return (
    <section
      id="all-activities"
      className="scroll-mt-[var(--vybe-header-h)] w-full py-8 md:py-10"
    >
      <StickyFilterBar>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-text">
          <SlidersHorizontal className="size-3.5" />
          Filters
          <ChevronDown className="size-3.5 text-text-muted" />
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

        <Link
          href={hrefFor({ category: category === "budget" ? "" : "budget" })}
          scroll={false}
          className={chipClass(category === "budget")}
        >
          Under ₹600
        </Link>

        <Link
          href={hrefFor({ category: category === "top" ? "" : "top" })}
          scroll={false}
          className={chipClass(category === "top")}
        >
          Top rated
        </Link>

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

      <Container className="mt-7">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
            All activities
          </h2>
          <p className="text-[14px] font-semibold text-text-muted">
            {filtered.length} {filtered.length === 1 ? "activity" : "activities"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No activities for this filter" />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6">
            {filtered.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                className="!w-full sm:!w-full"
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
