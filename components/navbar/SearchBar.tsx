"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";

type SearchBarProps = {
  overlay?: boolean;
  variant?: "desktop" | "mobile";
};

export function SearchBar({ overlay = false, variant = "desktop" }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  if (variant === "mobile") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-border bg-surface-muted px-3.5 text-left transition-colors hover:border-border-strong"
        >
          <Search className="size-[18px] shrink-0 text-text-muted" strokeWidth={2.25} />
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
      <div className="flex items-center gap-2.5">
        {expanded ? (
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setOpen(true);
              }
            }}
            placeholder="Search movies and events"
            aria-label="Search"
            className={`h-[38px] w-[160px] rounded-full border px-3 text-[13px] outline-none xl:w-[200px] ${
              overlay
                ? "border-white/35 bg-white/12 text-white placeholder:text-white/70"
                : "border-black/10 bg-[#faf6ef] text-text placeholder:text-text-muted dark:border-white/15 dark:bg-white/10 dark:text-white"
            }`}
          />
        ) : null}
        <button
          type="button"
          aria-label={expanded ? "Close search" : "Search"}
          aria-expanded={expanded}
          onClick={() => {
            if (expanded && query.trim()) {
              setOpen(true);
              return;
            }
            if (expanded) {
              setExpanded(false);
              setQuery("");
              return;
            }
            setExpanded(true);
          }}
          className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
            overlay
              ? "text-white hover:bg-white/15"
              : "text-text hover:bg-black/[0.06] dark:text-white dark:hover:bg-white/10"
          }`}
        >
          {expanded && !query.trim() ? (
            <X className="size-[18px]" strokeWidth={1.8} />
          ) : (
            <Search className="size-[18px]" strokeWidth={1.8} />
          )}
        </button>
      </div>
      <SearchOverlay
        open={open}
        onClose={() => {
          setOpen(false);
          setExpanded(false);
          setQuery("");
        }}
      />
    </>
  );
}
