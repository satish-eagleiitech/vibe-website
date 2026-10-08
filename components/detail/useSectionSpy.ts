"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Extra space below the navbar taken by the compact sticky tab bar */
const STICKY_BAR_OFFSET = 140;

function headerHeight() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--vybe-header-h")
    .trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 60;
}

/**
 * Highlights the tab for whichever `${prefix}-${id}` section is under the
 * sticky bar, and scrolls to a section when a tab is clicked.
 */
export function useSectionSpy<T extends string>(
  prefix: string,
  ids: readonly T[],
) {
  const [active, setActive] = useState<T>(ids[0]);
  const lockUntilRef = useRef(0);
  const idsKey = ids.join("|");

  useEffect(() => {
    const sectionIds = idsKey.split("|") as T[];
    let frame = 0;

    const update = () => {
      frame = 0;
      if (Date.now() < lockUntilRef.current) return;

      const line = headerHeight() + STICKY_BAR_OFFSET;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      let next = sectionIds[0];
      for (const id of sectionIds) {
        const node = document.getElementById(`${prefix}-${id}`);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) next = id;
      }
      if (atBottom) {
        const last = [...sectionIds]
          .reverse()
          .find((id) => document.getElementById(`${prefix}-${id}`));
        if (last) next = last;
      }

      setActive((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefix, idsKey]);

  const scrollTo = useCallback(
    (id: T) => {
      setActive(id);
      lockUntilRef.current = Date.now() + 900;
      document.getElementById(`${prefix}-${id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [prefix],
  );

  return { active, scrollTo };
}
