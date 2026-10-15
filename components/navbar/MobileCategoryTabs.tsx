"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  PartyPopper,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

const icons: Record<(typeof siteConfig.nav)[number]["href"], LucideIcon> = {
  "/movies": Clapperboard,
  "/events": PartyPopper,
  "/activities": Sparkles,
  "/play": Trophy,
};

/** Compact names-only while scrolling down; icon + name when scrolling up / at top (mobile). */
export function MobileCategoryTabs() {
  const pathname = usePathname();
  const [showIcons, setShowIcons] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 24) {
        setShowIcons(true);
      } else if (delta > 6) {
        setShowIcons(false);
      } else if (delta < -6) {
        setShowIcons(true);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav aria-label="Categories" className="border-t border-transparent">
      <Container
        fullWidth
        className={`grid max-w-none grid-cols-4 items-center gap-0.5 px-3 transition-[height,padding] duration-200 sm:gap-1 sm:px-4 ${
          showIcons ? "h-12 pb-1.5 sm:h-11" : "h-10 pb-1 sm:h-9"
        }`}
      >
        {siteConfig.nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = icons[item.href];

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-full items-center justify-center gap-0.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors sm:text-[13px] ${
                showIcons ? "flex-col sm:flex-row sm:gap-1.5" : "flex-row"
              } ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text"
              }`}
            >
              {showIcons ? (
                <Icon className="size-[18px] shrink-0" strokeWidth={2} />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
