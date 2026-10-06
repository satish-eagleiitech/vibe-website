"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

type NavLinksProps = {
  overlay?: boolean;
};

export function NavLinks({ overlay = false }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center justify-center gap-3 md:flex lg:gap-5 xl:gap-6 2xl:gap-7"
      aria-label="Primary"
    >
      {siteConfig.nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-1.5 text-[14px] font-bold tracking-tight whitespace-nowrap transition-colors ${
              active
                ? "bg-accent text-white"
                : overlay
                  ? "text-white/90 hover:bg-white/15 hover:text-white"
                  : "text-text hover:bg-black/[0.06] dark:hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
