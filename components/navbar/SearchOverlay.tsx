"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fallbackActivities,
  fallbackEvents,
  fallbackMovies,
  fallbackPlay,
} from "@/lib/data/fallback";
import { publicEnv } from "@/config/public";

type SearchCategory =
  | "all"
  | "events"
  | "movies"
  | "activities"
  | "play";

type SearchHit = {
  id: string;
  title: string;
  label: string;
  href: string;
  imageUrl: string;
  meta?: string;
  category: SearchCategory;
};

const FILTERS: { id: SearchCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "events", label: "Events" },
  { id: "activities", label: "Activities" },
  { id: "play", label: "Play" },
];

function buildCatalog(): SearchHit[] {
  const movies: SearchHit[] = fallbackMovies.map((item) => ({
    id: `movie-${item.id}`,
    title: item.title,
    label: "Movie",
    href: `/movies/${item.id}`,
    imageUrl: item.posterUrl,
    meta: item.genres.slice(0, 2).join(", "),
    category: "movies",
  }));

  const events: SearchHit[] = fallbackEvents.map((item) => ({
    id: `event-${item.id}`,
    title: item.title,
    label: "Event",
    href: `/events/${item.id}`,
    imageUrl: item.imageUrl,
    meta: `${item.month} ${item.day} · ${item.venue}`,
    category: "events",
  }));

  const activities: SearchHit[] = fallbackActivities.map((item) => ({
    id: `activity-${item.id}`,
    title: item.title,
    label: "Activity",
    href: `/activities/${item.id}`,
    imageUrl: item.imageUrl,
    meta: item.venue || item.schedule,
    category: "activities",
  }));

  const play: SearchHit[] = fallbackPlay.map((item) => ({
    id: `play-${item.id}`,
    title: item.title,
    label: "Play",
    href: `/play/${item.id}`,
    imageUrl: item.imageUrl,
    meta: item.venue || item.schedule,
    category: "play",
  }));

  return [...movies, ...events, ...activities, ...play];
}

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchCategory>("all");
  const catalog = useMemo(() => buildCatalog(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setFilter("all");
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      if (filter !== "all" && item.category !== filter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        (item.meta ?? "").toLowerCase().includes(q)
      );
    });
  }, [catalog, filter, query]);

  const trending = useMemo(() => {
    if (query.trim()) return results.slice(0, 12);
    const pool =
      filter === "all"
        ? catalog
        : catalog.filter((item) => item.category === filter);
    return pool.slice(0, 12);
  }, [catalog, filter, query, results]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 py-10 backdrop-blur-[3px] md:py-14 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search VYBE"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl dark:border-white/10 dark:bg-sheet dark:shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
      >
        <div className="border-b border-border p-4 md:p-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <label className="label-focus-ring-none flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-border bg-bg px-3.5 dark:border-white/12 dark:bg-surface-muted">
              <Search className="size-4 shrink-0 text-accent" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search for movies, events, activities in ${publicEnv.defaultCity}`}
                className="w-full bg-transparent text-sm font-semibold text-text outline-none ring-0 placeholder:text-text-muted"
                autoFocus
              />
            </label>
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
              className="focus-ring-none inline-flex size-10 items-center justify-center rounded-full bg-surface-muted text-text transition-colors hover:bg-accent hover:text-white dark:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                    active
                      ? "bg-accent text-white shadow-[0_6px_16px_rgba(255,0,91,0.28)]"
                      : "bg-surface-muted text-text hover:bg-border dark:bg-white/8 dark:hover:bg-white/14"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[calc(88vh-140px)] overflow-y-auto p-4 md:p-5">
          <h3 className="text-[16px] font-extrabold text-text">
            {query.trim()
              ? `Results (${trending.length})`
              : `Trending in ${publicEnv.defaultCity}`}
          </h3>

          {trending.length === 0 ? (
            <p className="mt-6 text-sm text-text-secondary">
              No matches. Try another category or keyword.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {trending.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-surface-muted dark:hover:bg-white/6"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-extrabold text-text">
                      {item.title}
                    </span>
                    <span className="block text-[12px] text-text-secondary">
                      {item.label}
                    </span>
                    {item.meta ? (
                      <span className="mt-0.5 block truncate text-[11px] text-text-muted">
                        {item.meta}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
