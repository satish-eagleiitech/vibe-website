"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export type MovieFilterValues = {
  languages: string[];
  genres: string[];
  formats: string[];
};

type FilterPanel = "genre" | "language" | "format";

type MovieFilterModalProps = {
  open: boolean;
  initial: MovieFilterValues;
  genreOptions: readonly string[];
  formatOptions: readonly string[];
  onClose: () => void;
  onApply: (values: MovieFilterValues) => void;
  onClear: () => void;
};

const PANELS: { id: FilterPanel; label: string }[] = [
  { id: "genre", label: "Genre" },
  { id: "language", label: "Language" },
  { id: "format", label: "Format" },
];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function MovieFilterModal({
  open,
  initial,
  genreOptions,
  formatOptions,
  onClose,
  onApply,
  onClear,
}: MovieFilterModalProps) {
  const [panel, setPanel] = useState<FilterPanel>("genre");
  const [draft, setDraft] = useState<MovieFilterValues>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const languageOptions = siteConfig.languages.filter((item) => item.id !== "all");

  const options =
    panel === "genre"
      ? genreOptions.map((g) => ({ id: g, label: g }))
      : panel === "language"
        ? languageOptions.map((l) => ({ id: l.id, label: l.label }))
        : formatOptions.map((f) => ({ id: f, label: f }));

  const selectedKey =
    panel === "genre" ? "genres" : panel === "language" ? "languages" : "formats";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-filter-title"
        className="w-full max-w-md overflow-hidden rounded-[28px] bg-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <h2 id="movie-filter-title" className="text-[22px] font-extrabold tracking-tight text-text">
            Filter by
          </h2>
        </div>

        <div className="flex gap-0 px-4 pb-4">
          <nav
            aria-label="Filter categories"
            className="flex w-[108px] shrink-0 flex-col gap-0.5 pr-2"
          >
            {PANELS.map((item) => {
              const active = panel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPanel(item.id)}
                  className={`rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-text-secondary hover:bg-surface-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="min-h-[220px] flex-1 overflow-y-auto rounded-2xl bg-surface-muted p-4">
            <ul className="space-y-3">
              {options.map((option) => {
                const checked = draft[selectedKey].includes(option.id);
                return (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-text">
                      <span
                        className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          checked ? "border-accent bg-accent" : "border-border bg-surface"
                        }`}
                      >
                        {checked ? (
                          <span className="size-2 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            [selectedKey]: toggle(current[selectedKey], option.id),
                          }))
                        }
                      />
                      {option.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setDraft({ languages: [], genres: [], formats: [] });
              onClear();
            }}
            className="text-[14px] font-semibold text-text underline decoration-dotted underline-offset-4 hover:text-accent"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="min-w-[160px] rounded-full bg-sidebar py-3 text-[14px] font-extrabold text-white transition-colors hover:bg-accent dark:bg-accent dark:hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
