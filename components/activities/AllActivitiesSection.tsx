"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ListingFilterModal } from "@/components/common/ListingFilterModal";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import type { Activity } from "@/types/activity";

type AllActivitiesSectionProps = {
  activities: Activity[];
  category?: string;
  when?: string;
};

const ALL_CATEGORIES = [
  { id: "budget", label: "Under ₹600" },
  { id: "top", label: "Top rated" },
  { id: "Outdoor", label: "Outdoor" },
  { id: "Water", label: "Water" },
  { id: "Workshop", label: "Workshop" },
  { id: "Adventure", label: "Adventure" },
  { id: "Indoor", label: "Indoor" },
  { id: "Camping", label: "Camping" },
  { id: "Theme Parks", label: "Theme Parks" },
  { id: "Kids", label: "Kids" },
] as const;

/** Short chip row — rest live in the Filters modal */
const QUICK_CATEGORIES = ALL_CATEGORIES.slice(0, 5);

const WHEN_FILTERS = [
  { id: "weekend", label: "Weekends" },
  { id: "today", label: "Today" },
] as const;

function matchesCategory(activity: Activity, category?: string) {
  if (!category) return true;
  if (category === "top") return activity.price >= 999;
  if (category === "budget") return activity.price <= 599;

  const needle = decodeURIComponent(category).toLowerCase().replace(/-/g, " ");
  const hay = `${activity.category} ${activity.title} ${activity.venue ?? ""}`.toLowerCase();

  if (needle === "kids") return /kid|family|play/.test(hay);
  if (needle === "fitness") return /fitness|gym|climb|yoga|cycle/.test(hay);
  if (needle === "water parks" || needle === "water") {
    return /water|pool|splash/.test(hay) || activity.category.toLowerCase().includes("water");
  }
  if (needle === "theme parks") {
    return /theme|wonderla|amusement/.test(hay) || activity.category.toLowerCase() === "theme parks";
  }
  if (needle === "monuments") {
    return /monument|fort|heritage|golconda/.test(hay);
  }
  if (needle === "game zones" || needle === "indoor") {
    return (
      activity.category.toLowerCase() === "indoor" ||
      /game|bowling|laser|vr|arcade/.test(hay)
    );
  }

  return activity.category.toLowerCase() === needle || hay.includes(needle);
}

function matchesWhen(activity: Activity, when?: string) {
  if (!when) return true;
  const schedule = (activity.schedule ?? "").toLowerCase();
  if (when === "weekend") return /sat|sun|weekend/.test(schedule);
  if (when === "today") return /daily|today|multiple/.test(schedule);
  return true;
}

export function AllActivitiesSection({
  activities,
  category: categoryProp = "",
  when: whenProp = "",
}: AllActivitiesSectionProps) {
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

  const filtered = useMemo(() => {
    let list = activities.filter(
      (item) => matchesCategory(item, category) && matchesWhen(item, when),
    );
    if (category === "top") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activities, category, when]);

  function syncUrl(nextCategory: string, nextWhen: string) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextWhen) params.set("when", nextWhen);
    const qs = params.toString();
    router.replace(
      qs ? `${pathname}?${qs}#all-activities` : `${pathname}#all-activities`,
      { scroll: false },
    );
  }

  function selectCategory(id: string) {
    const next = category.toLowerCase() === id.toLowerCase() ? "" : id;
    setCategory(next);
    syncUrl(next, when);
  }

  function selectWhen(id: string) {
    const next = when === id ? "" : id;
    setWhen(next);
    syncUrl(category, next);
  }

  function chipClass(selected: boolean) {
    return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
      selected
        ? "border-accent bg-accent-soft text-accent"
        : "border-border bg-surface text-text hover:border-accent/40"
    }`;
  }

  const filterActive = Boolean(category || when);

  return (
    <section
      id="all-activities"
      className="scroll-mt-[var(--vybe-header-h)] w-full overflow-x-clip pt-3 md:pt-6 lg:pt-10"
    >
      <Container>
        <div className="mb-5 md:mb-6">
          <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[30px]">
            All activities
          </h2>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            Parks, thrills and day trips near you
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

        {QUICK_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectCategory(item.id)}
            className={chipClass((category || "").toLowerCase() === item.id.toLowerCase())}
          >
            {item.label}
          </button>
        ))}
      </StickyFilterBar>

      <Container className="pt-6 pb-10 md:pt-8 md:pb-12">
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

      <ListingFilterModal
        open={filterOpen}
        values={{ category }}
        panels={[
          {
            id: "category",
            label: "Category",
            options: ALL_CATEGORIES.map((item) => ({ id: item.id, label: item.label })),
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
