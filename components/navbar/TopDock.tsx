"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { LocationButton } from "@/components/navbar/LocationButton";
import { ProfileLink } from "@/components/navbar/ProfileLink";
import { SearchBar } from "@/components/navbar/SearchBar";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { siteConfig } from "@/config/site";

const TAB_ICONS: Record<(typeof siteConfig.nav)[number]["href"], string> = {
  "/movies": "/icons/nav-movies.png",
  "/events": "/icons/nav-events.png",
  "/activities": "/icons/nav-activities.png",
  "/play": "/icons/nav-play.png",
};

function TabIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-[18px] shrink-0 bg-current"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function NavTab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex shrink-0 items-center gap-1.5 px-1.5 py-1 text-[13px] font-semibold transition-colors sm:px-2 ${
        active
          ? "text-accent"
          : "text-text/75 hover:text-text dark:text-white/70 dark:hover:text-white"
      }`}
    >
      <TabIcon src={icon} />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

/** Logo and profile sit apart from the nav bar, which hangs from the top. */
export function TopDock() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chrome = solid
    ? "bg-(--vybe-nav) shadow-[0_8px_18px_rgba(0,0,0,0.12)] backdrop-blur-none dark:shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
    : "bg-white/40 shadow-none backdrop-blur-xl dark:bg-black/35";

  return (
    <div className="pointer-events-auto grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-3 sm:gap-4 sm:px-4">
      <div className="relative z-10 flex min-w-0 items-center gap-1.5 self-stretch sm:gap-2">
        <Logo priority />
        <LocationButton
          variant="dock"
          overlay={
            (pathname === "/" ||
              /^\/movies\/[^/]+$/.test(pathname) ||
              /^\/movies\/[^/]+\/seats$/.test(pathname)) &&
            !solid
          }
        />
      </div>

      <div className="flex min-w-0 justify-center">
        <div
          className={`max-w-full overflow-hidden rounded-b-[28px] transition-[background-color,box-shadow,backdrop-filter] duration-300 ${chrome}`}
        >
          <div className="flex min-w-0 items-center px-5 pt-2.5 pb-3 sm:px-6">
            <nav
              aria-label="Primary"
              className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto hide-scrollbar sm:gap-2"
            >
              {siteConfig.nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <NavTab
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={TAB_ICONS[item.href]}
                    active={active}
                  />
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <div
          className={`grid size-9 place-items-center rounded-full ring-1 ring-black/10 transition-[background-color,box-shadow,backdrop-filter] duration-300 dark:ring-white/15 ${chrome}`}
        >
          <SearchBar variant="dock" />
        </div>
        <div
          className={`grid size-9 place-items-center rounded-full ring-1 ring-black/10 transition-[background-color,box-shadow,backdrop-filter] duration-300 dark:ring-white/15 ${chrome}`}
        >
          <ThemeToggle dock />
        </div>
        <ProfileLink dock />
      </div>
    </div>
  );
}
