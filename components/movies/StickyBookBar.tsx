"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";

type StickyBookBarProps = {
  title: string;
  bookHref: string;
  heroId?: string;
  bookLabel?: string;
};

export function StickyBookBar({
  title,
  bookHref,
  heroId = "movie-detail-hero",
  bookLabel = "Book tickets",
}: StickyBookBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  return (
    <div
      className={`fixed inset-x-0 top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl transition-all duration-300 ${
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
        <Link
          href={bookHref}
          tabIndex={visible ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[14px] font-extrabold text-white transition-transform hover:scale-[1.02] md:px-7 md:py-3 md:text-[15px]"
        >
          <Ticket className="size-4 md:size-5" />
          {bookLabel}
        </Link>
      </Container>
    </div>
  );
}
