"use client";

import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { BookTicketsButton } from "@/components/movies/BookTicketsButton";

type StickyBookBarProps = {
  title: string;
  bookHref: string;
  heroId?: string;
  bookLabel?: string;
  certification?: string;
};

export function StickyBookBar({
  title,
  bookHref,
  heroId = "movie-detail-hero",
  bookLabel = "Book tickets",
  certification,
}: StickyBookBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const next = hero.getBoundingClientRect().bottom < 72;
      setVisible((prev) => (prev === next ? prev : next));
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
  }, [heroId]);

  useEffect(() => {
    document.documentElement.classList.toggle("vybe-nav-hidden", visible);
    return () => document.documentElement.classList.remove("vybe-nav-hidden");
  }, [visible]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[60] border-b border-border bg-surface/95 backdrop-blur-xl transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
        <h2 className="truncate text-[18px] font-extrabold tracking-tight text-text md:text-[22px]">
          {title}
        </h2>
        <BookTicketsButton
          href={bookHref}
          certification={certification}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.02] md:px-7 md:py-3 md:text-[15px]"
        >
          <Ticket className="size-4 md:size-5" />
          {bookLabel}
        </BookTicketsButton>
      </Container>
    </div>
  );
}
