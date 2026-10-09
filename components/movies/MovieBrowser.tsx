"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { StickyFilterBar } from "@/components/common/StickyFilterBar";
import {
  MovieFilterModal,
  type MovieFilterValues,
} from "@/components/movies/MovieFilterModal";
import { MoviePosterCard } from "@/components/movies/MoviePosterCard";
import { useCardStand } from "@/components/movies/useCardStand";
import type { Movie } from "@/types/movie";

export type MovieBrowseCatalogs = {
  all: Movie[];
  telugu: Movie[];
  hindi: Movie[];
  english: Movie[];
  topRated: Movie[];
};

type MovieBrowserProps = {
  latest: Movie[];
  catalogs: MovieBrowseCatalogs;
};

const LANGUAGE_TABS = [
  { id: "telugu", label: "Telugu" },
  { id: "hindi", label: "Hindi" },
  { id: "english", label: "English" },
] as const;

const GENRE_TABS = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Thriller",
  "Romance",
  "Family",
  "Horror",
  "Fantasy",
] as const;

const FORMAT_OPTIONS = ["2D", "3D", "4DX-3D", "4DX-2D", "IMAX"] as const;

type QuickTab = "all" | "telugu" | "hindi" | "english" | "rating" | (typeof GENRE_TABS)[number];

const EMPTY_FILTERS: MovieFilterValues = {
  languages: [],
  genres: [],
  formats: [],
};

function isGenreTab(tab: QuickTab): tab is (typeof GENRE_TABS)[number] {
  return (GENRE_TABS as readonly string[]).includes(tab);
}

function movieHasLanguage(movie: Movie, lang: string) {
  return movie.languages.some((item) => item.toLowerCase() === lang.toLowerCase());
}

function movieMatchesFormats(movie: Movie, formats: string[]) {
  if (!formats.length) return true;
  const hay = `${movie.formatBadge ?? ""} ${movie.statusBadge ?? ""}`.toUpperCase();
  return formats.some((format) => hay.includes(format.toUpperCase().replace(/-/g, "")));
}

function applyModalFilters(list: Movie[], filters: MovieFilterValues) {
  return list.filter((movie) => {
    if (filters.languages.length) {
      const ok = filters.languages.some((lang) => movieHasLanguage(movie, lang));
      if (!ok) return false;
    }
    if (filters.genres.length) {
      const ok = filters.genres.some((genre) => movie.genres.includes(genre));
      if (!ok) return false;
    }
    if (!movieMatchesFormats(movie, filters.formats)) return false;
    return true;
  });
}

export function MovieBrowser({ latest, catalogs }: MovieBrowserProps) {
  const [quickTab, setQuickTab] = useState<QuickTab>("all");
  const [modalFilters, setModalFilters] = useState<MovieFilterValues>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [genreCatalogs, setGenreCatalogs] = useState<Partial<Record<string, Movie[]>>>({});
  const [genreLoading, setGenreLoading] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isGenreTab(quickTab)) return;
    if (genreCatalogs[quickTab]?.length) return;

    let cancelled = false;
    setGenreLoading(true);
    fetch(`/api/movies/catalog?genre=${encodeURIComponent(quickTab)}&limit=40`)
      .then((response) => response.json())
      .then((payload: { items?: Movie[] }) => {
        if (cancelled) return;
        setGenreCatalogs((current) => ({
          ...current,
          [quickTab]: payload.items ?? [],
        }));
      })
      .catch(() => {
        if (!cancelled) {
          setGenreCatalogs((current) => ({ ...current, [quickTab]: [] }));
        }
      })
      .finally(() => {
        if (!cancelled) setGenreLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quickTab, genreCatalogs]);

  const baseList = useMemo(() => {
    switch (quickTab) {
      case "telugu":
        return catalogs.telugu;
      case "hindi":
        return catalogs.hindi;
      case "english":
        return catalogs.english;
      case "rating":
        return catalogs.topRated;
      case "all":
        return catalogs.all;
      default:
        return genreCatalogs[quickTab] ?? [];
    }
  }, [quickTab, catalogs, genreCatalogs]);

  const visible = useMemo(() => {
    let list = baseList;
    list = applyModalFilters(list, modalFilters);
    if (quickTab === "rating") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return list;
  }, [baseList, quickTab, modalFilters]);

  useCardStand(gridRef, cardsRef, genreLoading ? null : visible);

  const gridHeading = useMemo(() => {
    if (modalFilters.languages.length || modalFilters.genres.length || modalFilters.formats.length) {
      return "Filtered results";
    }
    switch (quickTab) {
      case "telugu":
        return "Telugu";
      case "hindi":
        return "Hindi";
      case "english":
        return "English";
      case "rating":
        return "Top rated";
      case "all":
        return "Movies";
      default:
        return quickTab;
    }
  }, [quickTab, modalFilters]);

  const filterActive =
    modalFilters.languages.length > 0 ||
    modalFilters.genres.length > 0 ||
    modalFilters.formats.length > 0;

  function scrollRail(dir: number) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  function tabClass(active: boolean) {
    return `relative shrink-0 py-4 text-[14px] font-semibold transition-colors ${
      active ? "text-text" : "text-text-secondary hover:text-text"
    }`;
  }

  function underline(active: boolean) {
    return (
      <span
        className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-accent transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    );
  }

  function scrollToGrid() {
    requestAnimationFrame(() => {
      const grid = gridRef.current;
      if (!grid) return;
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--vybe-header-h"),
        ) || 0;
      const bar = (browseRef.current?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
      const padding = parseFloat(getComputedStyle(grid).paddingTop) || 0;
      const top =
        grid.getBoundingClientRect().top + window.scrollY - header - bar + padding - 20;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  function selectQuickTab(id: QuickTab) {
    setQuickTab((current) => (current === id ? "all" : id));
    scrollToGrid();
  }

  return (
    <div id="browse" ref={browseRef} className="scroll-mt-[var(--vybe-header-h)]">
      <StickyFilterBar containerClassName="gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-colors ${
              filterActive
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-surface text-text hover:border-accent/50"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            Filters
            <ChevronDown className="size-4 opacity-70" />
          </button>

          <div
            role="tablist"
            aria-label="Movie categories"
            className="hide-scrollbar flex min-w-0 flex-1 items-center gap-6 overflow-x-auto md:gap-8"
          >
            {LANGUAGE_TABS.map((item) => {
              const active = quickTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectQuickTab(item.id)}
                  className={tabClass(active)}
                >
                  {item.label}
                  {underline(active)}
                </button>
              );
            })}

            <button
              type="button"
              role="tab"
              aria-selected={quickTab === "rating"}
              onClick={() => selectQuickTab("rating")}
              className={tabClass(quickTab === "rating")}
            >
              Top rated
              {underline(quickTab === "rating")}
            </button>

            {GENRE_TABS.map((genre) => {
              const active = quickTab === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectQuickTab(genre)}
                  className={tabClass(active)}
                >
                  {genre}
                  {underline(active)}
                </button>
              );
            })}
          </div>
      </StickyFilterBar>

      <MovieFilterModal
        open={filterOpen}
        initial={modalFilters}
        genreOptions={GENRE_TABS}
        formatOptions={FORMAT_OPTIONS}
        onClose={() => setFilterOpen(false)}
        onApply={(values) => {
          setModalFilters(values);
          scrollToGrid();
        }}
        onClear={() => {
          setModalFilters(EMPTY_FILTERS);
          setQuickTab("all");
        }}
      />

      {latest.length > 0 ? (
        <section className="border-b border-border bg-surface py-8 md:py-10 dark:bg-surface/60">
          <Container>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[24px]">
                  Latest added
                </h2>
                <p className="mt-0.5 text-[13px] text-text-secondary">
                  Fresh titles hitting cinemas near you
                </p>
              </div>
              <div className="flex gap-2 xl:hidden">
                <RailButton dir={-1} onClick={scrollRail} />
                <RailButton dir={1} onClick={scrollRail} />
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-[38%] -left-14 hidden -translate-y-1/2 xl:block">
                <RailButton dir={-1} onClick={scrollRail} />
              </div>
              <div
                ref={railRef}
                className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-5"
              >
                {latest.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="w-[42%] shrink-0 snap-start sm:w-[28%] md:w-[22%] lg:w-[18%] xl:w-[calc((100%-5rem)/5)]"
                  >
                    <MoviePosterCard movie={movie} priority={index < 5} />
                  </div>
                ))}
              </div>
              <div className="absolute top-[38%] -right-14 hidden -translate-y-1/2 xl:block">
                <RailButton dir={1} onClick={scrollRail} />
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      <section ref={gridRef} className="overflow-x-clip py-10 md:py-12">
        <Container>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-[clamp(2.25rem,4vw,3.75rem)] leading-[0.92] font-semibold tracking-[-0.04em] capitalize">
                {gridHeading.split(" ").map((word, i) => (
                  <span key={`${word}-${i}`} data-stand-word>
                    {i > 0 ? " " : ""}
                    {word}
                  </span>
                ))}
              </h2>
              <p className="max-w-md text-[14px] leading-[1.4] font-semibold text-text-muted">
                Grab best seats at theatres around you
              </p>
            </div>
            <p className="text-[14px] font-semibold text-text-muted">
              {visible.length} {visible.length === 1 ? "title" : "titles"}
            </p>
          </div>
          {genreLoading && isGenreTab(quickTab) ? (
            <p className="text-[14px] font-medium text-text-secondary">Loading movies…</p>
          ) : visible.length === 0 ? (
            <EmptyState title="No movies found for this filter" />
          ) : (
            <div
              ref={cardsRef}
              className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 lg:grid-cols-5 xl:grid-cols-6"
            >
              {visible.map((movie) => (
                <MoviePosterCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function RailButton({ dir, onClick }: { dir: 1 | -1; onClick: (dir: number) => void }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={dir < 0 ? "Previous movies" : "Next movies"}
      onClick={() => onClick(dir)}
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-bg text-text shadow-sm transition-colors hover:border-accent hover:bg-accent hover:text-white"
    >
      <Icon className="size-5" />
    </button>
  );
}
