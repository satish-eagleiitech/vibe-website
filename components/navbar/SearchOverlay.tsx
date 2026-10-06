"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fallbackActivities,
  fallbackDining,
  fallbackEvents,
  fallbackMovies,
  fallbackPlay,
} from "@/lib/data/fallback";
import { publicEnv } from "@/config/public";

type SearchCategory =
  | "all"
  | "dining"
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
  { id: "dining", label: "Dining" },
  { id: "events", label: "Events" },
  { id: "movies", label: "Movies" },
  { id: "activities", label: "Activities" },
  { id: "play", label: "Game Zone" },
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

  const dining: SearchHit[] = fallbackDining.map((item) => ({
    id: `dining-${item.id}`,
    title: item.name,
    label: "Restaurant",
    href: `/dining/${item.id}`,
    imageUrl: item.imageUrl,
    meta: item.locality || item.cuisine,
    category: "dining",
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
    label: "Game Zone",
    href: `/play/${item.id}`,
    imageUrl: item.imageUrl,
    meta: item.venue || item.schedule,
    category: "play",
  }));

  return [...movies, ...events, ...dining, ...activities, ...play];
}

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  overlayChrome?: boolean;
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
    return () => window.removeEventListener("keydown", onKey);
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
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 px-4 py-10 backdrop-blur-[2px] md:py-14">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search VYBE"
        className="relative max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
      >
        <div className="border-b border-border p-4 md:p-5">
          <div className="flex items-center gap-3">
            <label className="flex h-12 flex-1 items-center gap-2 rounded-xl border border-border bg-bg px-3 focus-within:border-border">
              <Search className="size-4 text-text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search for movies, dining, events in ${publicEnv.defaultCity}`}
                className="w-full bg-transparent text-sm font-semibold text-text outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none placeholder:text-text-muted"
                autoFocus
              />
            </label>
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-full bg-surface-muted text-text"
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
                      ? "bg-accent text-white"
                      : "bg-surface-muted text-text hover:bg-border"
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
                  className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-surface-muted"
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
