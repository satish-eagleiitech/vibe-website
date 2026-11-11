"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, MapPin, Moon, Search, Sun, X } from "lucide-react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";
import { TAB_ICONS, TabIcon } from "@/components/navbar/NavTabIcon";
import { useTheme } from "@/components/theme/ThemeProvider";
import { publicEnv } from "@/config/public";
import { siteConfig } from "@/config/site";
import { readSavedLocation } from "@/lib/location/cities";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const DRAWER_EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

const subscribeNothing = () => () => {};

function subscribeCity(onChange: () => void) {
  window.addEventListener("vybe-city-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("vybe-city-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Hamburger + full-height side drawer used up to 768px, where the dock tabs don't fit. */
export function MobileNavMenu({ chrome }: { chrome: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolved, setAppearance } = useTheme();
  const { gate, modal } = useLoginGate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const city = useSyncExternalStore(
    subscribeCity,
    () => readSavedLocation()?.city || publicEnv.defaultCity,
    () => publicEnv.defaultCity,
  );
  const isDark = resolved === "dark";

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 769) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 250);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
    };
  }, [open]);

  const item = (index: number, className = "") => ({
    className: `transition-[opacity,translate] duration-500 ${EASE} ${
      open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
    } ${className}`,
    style: { transitionDelay: open ? `${120 + index * 45}ms` : "0ms" },
  });

  const rowClass =
    "group flex w-full items-center gap-3.5 rounded-2xl px-2.5 py-2.5 text-left text-[15px] font-semibold transition-colors";
  const idleRow =
    "text-text hover:bg-surface-muted dark:text-white dark:hover:bg-white/8";
  const iconTile =
    "grid size-10 shrink-0 place-items-center rounded-xl transition-colors";
  const sectionLabel =
    "px-2.5 pt-5 pb-1.5 text-[11px] font-bold tracking-[0.14em] text-text-muted uppercase";
  const navCount = siteConfig.nav.length;

  const drawer = (
    <div className="min-[769px]:hidden">
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/45 backdrop-blur-[3px] transition-opacity duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[71] flex w-[min(86vw,360px)] flex-col rounded-l-[28px] bg-(--vybe-nav) shadow-[-24px_0_60px_rgba(0,0,0,0.22)] transition-[translate,visibility] duration-500 ${DRAWER_EASE} dark:shadow-[-24px_0_60px_rgba(0,0,0,0.6)] ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 pt-5 pb-4 dark:border-white/10">
          <span className="text-[18px] font-extrabold text-text">Menu</span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className={`grid size-9 place-items-center rounded-full bg-surface-muted text-text transition-[rotate,background-color] duration-500 ${EASE} hover:bg-border dark:bg-white/8 dark:text-white ${
              open ? "rotate-0" : "-rotate-90"
            }`}
          >
            <X className="size-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pt-4 pb-4">
          <div {...item(0)}>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("vybe-open-location"));
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-muted/60 px-3.5 py-3 text-left transition-colors hover:bg-surface-muted dark:border-white/10 dark:bg-white/5"
            >
              <MapPin className="size-5 shrink-0 text-text" strokeWidth={2.1} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-bold tracking-[0.12em] text-text-muted uppercase">
                  Current location
                </span>
                <span className="block truncate text-[14px] font-bold text-text">
                  {city}
                </span>
              </span>
              <span className="text-[12px] font-bold text-text-secondary">Change</span>
            </button>
          </div>

          <p {...item(1, sectionLabel)}>
            Browse
          </p>
          <nav aria-label="Mobile">
            <ul className="space-y-0.5">
              {siteConfig.nav.map((link, index) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href} {...item(index + 2)}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`${rowClass} ${
                        active ? "bg-surface-muted text-accent dark:bg-white/8" : idleRow
                      }`}
                    >
                      <span
                        className={`${iconTile} ${
                          active
                            ? "bg-accent-soft text-accent"
                            : "bg-surface-muted text-text group-hover:bg-bg dark:bg-white/8 dark:text-white"
                        }`}
                      >
                        <TabIcon src={TAB_ICONS[link.href]} />
                      </span>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight
                        className="size-4 opacity-40 transition-[translate] group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p {...item(navCount + 2, sectionLabel)}>
            Preferences
          </p>
          <div className="space-y-0.5">
            <div {...item(navCount + 3)}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className={`${rowClass} ${idleRow}`}
              >
                <span
                  className={`${iconTile} bg-surface-muted group-hover:bg-bg dark:bg-white/8`}
                >
                  <Search className="size-[18px]" strokeWidth={1.9} />
                </span>
                <span className="flex-1">Search</span>
                <ChevronRight className="size-4 opacity-40" aria-hidden />
              </button>
            </div>

            <div {...item(navCount + 4)}>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={() => setAppearance(isDark ? "light" : "dark")}
                className={`${rowClass} ${idleRow}`}
              >
                <span
                  className={`${iconTile} bg-surface-muted group-hover:bg-bg dark:bg-white/8`}
                >
                  {isDark ? (
                    <Sun className="size-[18px]" strokeWidth={1.9} />
                  ) : (
                    <Moon className="size-[18px]" strokeWidth={1.9} />
                  )}
                </span>
                <span className="flex-1">Dark mode</span>
                <span
                  aria-hidden
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    isDark ? "bg-white" : "bg-black/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-[translate] duration-300 ${EASE} ${
                      isDark ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          {...item(
            navCount + 5,
            "shrink-0 border-t border-border px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-white/10",
          )}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              gate(() => router.push("/profile"), true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl bg-surface-muted px-3 py-3 text-left transition-colors hover:bg-border dark:bg-white/8 dark:hover:bg-white/12"
          >
            <span className="size-11 shrink-0 overflow-hidden rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.22)]">
              <Image
                src="/images/profile-avatar-3d.png"
                alt=""
                width={88}
                height={88}
                className="size-full object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-text">My profile</span>
              <span className="block truncate text-[12px] font-medium text-text-secondary">
                Tickets, saved & settings
              </span>
            </span>
            <ChevronRight className="size-4 text-text opacity-50" aria-hidden />
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((value) => !value)}
        className={`relative grid size-9 place-items-center rounded-full text-text ring-1 ring-black/10 transition-[background-color,box-shadow,backdrop-filter] duration-300 dark:text-white dark:ring-white/15 ${chrome}`}
      >
        <span aria-hidden className="relative block h-3 w-[18px]">
          <span
            className={`absolute right-0 h-[2px] w-full rounded-full bg-current transition-[top,rotate] duration-300 ${EASE} ${
              open ? "top-[5px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute top-[5px] right-0 h-[2px] rounded-full bg-current transition-[width,opacity] duration-200 ${
              open ? "w-0 opacity-0" : "w-3 opacity-100"
            }`}
          />
          <span
            className={`absolute right-0 h-[2px] rounded-full bg-current transition-[top,rotate,width] duration-300 ${EASE} ${
              open ? "top-[5px] w-full -rotate-45" : "top-[10px] w-2"
            }`}
          />
        </span>
      </button>

      {mounted ? createPortal(drawer, document.body) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      {modal}
    </>
  );
}
