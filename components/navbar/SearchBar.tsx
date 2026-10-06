"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";

type SearchBarProps = {
  overlay?: boolean;
  variant?: "desktop" | "mobile";
};

export function SearchBar({ overlay = false, variant = "desktop" }: SearchBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === "mobile" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-border bg-surface-muted px-3.5 text-left transition-colors hover:border-border-strong"
        >
          <Search className="size-[18px] shrink-0 text-text-muted" strokeWidth={2.25} />
          <span className="truncate text-[14px] font-medium text-text-muted">
            Search for events, movies and restaurants
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex h-10 w-[220px] items-center gap-2 rounded-full border px-3.5 text-left transition-colors xl:w-[260px] ${
            overlay
              ? "border-white/25 bg-white/15 text-white hover:bg-white/20"
              : "border-border bg-surface-muted text-text hover:bg-surface"
          }`}
        >
          <Search
            className={`size-4 shrink-0 ${overlay ? "text-white/80" : "text-text-muted"}`}
            strokeWidth={2.25}
          />
          <span
            className={`truncate text-[13px] font-medium ${
              overlay ? "text-white/70" : "text-text-muted"
            }`}
          >
            Search movies, events…
          </span>
        </button>
      )}

      <SearchOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
