"use client";

import { ArrowUp } from "lucide-react";

/** Sticky within the footer section only — not a page-wide floating button. */
export function ScrollToTopButton() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(255,0,91,0.35)] transition-transform hover:scale-105"
    >
      <ArrowUp className="size-5" strokeWidth={2.5} />
    </button>
  );
}
