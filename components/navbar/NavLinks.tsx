"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

type NavLinksProps = {
  overlay?: boolean;
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] shrink-0">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<string, ReactNode> = {
  "/movies": <Icon d="M4 7h16v12H4V7zm2 2v8h12V9H6zM8 4v3M16 4v3" />,
  "/events": <Icon d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2z" />,
  "/activities": (
    <Icon d="M12 3.2 14.2 8l5.3.5-4 3.6 1.2 5.1L12 14.6 7.3 17.2 8.5 12 4.5 8.5 9.8 8 12 3.2z" />
  ),
  "/play": <Icon d="M7 4.5v15l13-7.5L7 4.5z" />,
};

export function NavLinks({ overlay = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden min-w-0 flex-1 items-center justify-center gap-5 md:flex lg:gap-7 xl:gap-8"
      aria-label="Primary"
    >
      {siteConfig.nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors ${
              active
                ? overlay
                  ? "text-white"
                  : "text-text"
                : overlay
                  ? "text-white/82 hover:text-white"
                  : "text-[#4b4b4b] hover:text-text dark:text-white/70 dark:hover:text-white"
            }`}
          >
            {ICONS[item.href]}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
