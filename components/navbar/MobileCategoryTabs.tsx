"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  PartyPopper,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

const icons: Record<(typeof siteConfig.nav)[number]["href"], LucideIcon> = {
  "/movies": Clapperboard,
  "/events": PartyPopper,
  "/dining": UtensilsCrossed,
  "/activities": Sparkles,
  "/play": Trophy,
};

export function MobileCategoryTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Categories">
      <Container className="grid h-[60px] grid-cols-5 items-center gap-1 pb-2 sm:h-12 sm:gap-2">
        {siteConfig.nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = icons[item.href];

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-colors sm:h-9 sm:flex-row sm:rounded-full sm:text-[14px] ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text"
              }`}
            >
              <Icon className="size-[18px] sm:hidden" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </Container>
    </nav>
  );
}
