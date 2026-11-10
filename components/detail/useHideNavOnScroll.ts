"use client";

import { useEffect, useState } from "react";

/**
 * Hides the site navbar once `sentinelId` scrolls under the top of the viewport,
 * and restores it when the user scrolls back up.
 */
export function useHideNavOnScroll(sentinelId: string, enabled = true) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setCompact(false);
      return;
    }

    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const next = sentinel.getBoundingClientRect().top < 72;
      setCompact((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sentinelId, enabled]);

  useEffect(() => {
    const hide = compact && enabled;
    document.documentElement.classList.toggle("vybe-nav-hidden", hide);
    return () => document.documentElement.classList.remove("vybe-nav-hidden");
  }, [compact, enabled]);

  return compact;
}
