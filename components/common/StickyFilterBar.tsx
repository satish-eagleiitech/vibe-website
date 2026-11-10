"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/common/Container";

type StickyFilterBarProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Pin to the viewport top and hide the navbar while this bar is fixed. */
  pinToViewport?: boolean;
};

/** Sticks below the site header while scrolling category browse pages (matches Movies). */
export function StickyFilterBar({
  children,
  className,
  containerClassName,
  pinToViewport = false,
}: StickyFilterBarProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [slotHeight, setSlotHeight] = useState(0);

  useEffect(() => {
    if (!pinToViewport) return;
    const anchor = anchorRef.current;
    const bar = barRef.current;
    if (!anchor || !bar) return;

    let frame = 0;
    const update = () => {
      const section = anchor.closest("section");
      const top = anchor.getBoundingClientRect().top;
      const sectionBottom = section?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
      const barHeight = bar.offsetHeight;
      const next = top <= 0 && sectionBottom > barHeight + 4;
      setPinned((prev) => (prev === next ? prev : next));
      setSlotHeight((prev) => (next && prev !== barHeight ? barHeight : prev));
      document.documentElement.classList.toggle("vybe-nav-hidden", next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.classList.remove("vybe-nav-hidden");
    };
  }, [pinToViewport]);

  const placed = pinToViewport && pinned;

  return (
    <div ref={anchorRef} style={placed ? { height: slotHeight } : undefined}>
      <div
        ref={barRef}
        className={
          pinToViewport
            ? placed
              ? `fixed inset-x-0 top-0 z-[60] border-b border-border bg-bg ${className ?? ""}`
              : `relative z-30 bg-bg ${className ?? ""}`
            : `sticky top-(--vybe-header-h) z-30 -mt-px border-0 bg-bg/95 backdrop-blur-xl ${className ?? ""}`
        }
      >
        <Container
          className={`hide-scrollbar flex items-center gap-1.5 overflow-x-auto py-2 ${containerClassName ?? ""}`}
        >
          {children}
        </Container>
      </div>
    </div>
  );
}
