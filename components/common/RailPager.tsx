"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type RailPagerState = {
  side: "left" | "right";
  page: number;
  canPrev: boolean;
  canNext: boolean;
};

export function useRailPager() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lastLeft = useRef(0);
  const sideRef = useRef<"left" | "right">("right");
  const [pager, setPager] = useState<RailPagerState>({
    side: "right",
    page: 0,
    canPrev: false,
    canNext: true,
  });

  function syncPager(direction?: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const max = Math.max(el.scrollWidth - el.clientWidth, 1);
    const canPrev = el.scrollLeft > 8;
    const canNext = el.scrollLeft < max - 8;
    const page = el.scrollLeft / max > 0.45 ? 1 : 0;
    let side: "left" | "right" = direction ?? sideRef.current;
    if (!canPrev) side = "right";
    else if (!canNext) side = "left";
    sideRef.current = side;
    setPager({ side, page, canPrev, canNext });
  }

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const direction = el.scrollLeft > lastLeft.current ? "right" : "left";
    lastLeft.current = el.scrollLeft;
    syncPager(direction);
  }

  useEffect(() => {
    syncPager("right");
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => syncPager());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function scrollBy(dir: number, step?: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rail-card]");
    const measured = card ? card.getBoundingClientRect().width + 20 : 280;
    el.scrollBy({ left: dir * (step ?? measured), behavior: "smooth" });
  }

  return { scrollerRef, pager, onScroll, scrollBy };
}

type RailPagerProps = {
  pager: RailPagerState;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
};

export function RailPager({
  pager,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: RailPagerProps) {
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      {pager.side === "left" ? (
        <>
          <button
            type="button"
            aria-label={prevLabel}
            onClick={onPrev}
            disabled={!pager.canPrev}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <PagerDots page={pager.page} />
        </>
      ) : (
        <>
          <PagerDots page={pager.page} />
          <button
            type="button"
            aria-label={nextLabel}
            onClick={onNext}
            disabled={!pager.canNext}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}

function PagerDots({ page }: { page: number }) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span
        className={`size-2 rounded-full ${page === 0 ? "bg-text" : "bg-border"}`}
      />
      <span
        className={`size-2 rounded-full ${page === 1 ? "bg-text" : "bg-border"}`}
      />
    </div>
  );
}
