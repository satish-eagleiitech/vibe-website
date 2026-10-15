"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";
import { publicEnv } from "@/config/public";

type SearchBarProps = {
  overlay?: boolean;
  variant?: "desktop" | "mobile";
};

export function SearchBar({ overlay = false, variant = "desktop" }: SearchBarProps) {
  const [open, setOpen] = useState(false);

  if (variant === "mobile") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-border bg-surface-muted px-3.5 text-left transition-colors hover:border-border-strong"
        >
          <Search className="size-[18px] shrink-0 text-accent" strokeWidth={2.25} />
          <span className="truncate text-[14px] font-medium text-text-muted">
            Search for movies, events and activities
          </span>
        </button>
        <SearchOverlay open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className={`focus-ring-none hidden h-[40px] items-center gap-2 rounded-full border px-3.5 text-left transition-colors xl:inline-flex xl:w-[220px] 2xl:w-[260px] ${
          overlay
            ? "border-white/30 bg-white/12 text-white hover:bg-white/18"
            : "border-border bg-surface-muted text-text hover:border-border-strong dark:border-white/12 dark:bg-white/8"
        }`}
      >
        <Search
          className={`size-[16px] shrink-0 ${overlay ? "text-white" : "text-accent"}`}
          strokeWidth={2.1}
        />
        <span
          className={`truncate text-[13px] font-medium ${
            overlay ? "text-white/75" : "text-text-muted"
          }`}
        >
          Search {publicEnv.defaultCity}…
        </span>
      </button>

      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={`focus-ring-none inline-flex size-9 items-center justify-center rounded-full transition-colors xl:hidden ${
          overlay
            ? "text-white hover:bg-white/15"
            : "text-text hover:bg-black/[0.06] dark:text-white dark:hover:bg-white/10"
        }`}
      >
        <Search className="size-[18px]" strokeWidth={1.8} />
      </button>

      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
