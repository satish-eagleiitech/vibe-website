"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Moon, Search, Sun } from "lucide-react";
import { useLoginGate } from "@/components/auth/useLoginGate";
import { SearchOverlay } from "@/components/navbar/SearchOverlay";
import { TAB_ICONS, TabIcon } from "@/components/navbar/NavTabIcon";
import { useTheme } from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/config/site";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Hamburger + dropdown panel used up to 768px, where the dock tabs don't fit. */
export function MobileNavMenu({ chrome }: { chrome: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolved, setAppearance } = useTheme();
  const { gate, modal } = useLoginGate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
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
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  const item = (index: number) => ({
    className: `transition-[opacity,transform] duration-300 ${EASE} ${
      open ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
    }`,
    style: { transitionDelay: open ? `${80 + index * 40}ms` : "0ms" },
  });

  const rowClass =
    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[15px] font-semibold transition-colors";
  const idleRow =
    "text-text hover:bg-surface-muted dark:text-white dark:hover:bg-white/8";
  const navCount = siteConfig.nav.length;

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
            className={`absolute right-0 h-[2px] w-full rounded-full bg-current transition-[top,transform] duration-300 ${EASE} ${
              open ? "top-[5px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute top-[5px] right-0 h-[2px] rounded-full bg-current transition-[width,opacity] duration-200 ${
              open ? "w-0 opacity-0" : "w-3 opacity-100"
            }`}
          />
          <span
            className={`absolute right-0 h-[2px] rounded-full bg-current transition-[top,transform,width] duration-300 ${EASE} ${
              open ? "top-[5px] w-full -rotate-45" : "top-[10px] w-2"
            }`}
          />
        </span>
      </button>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 -z-10 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-nav-menu"
        inert={!open}
        className={`absolute inset-x-3 top-full mt-2 origin-top rounded-3xl sm:left-auto sm:w-[360px] sm:origin-top-right border border-border bg-(--vybe-nav) p-2 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-[opacity,transform,visibility] duration-300 ${EASE} dark:border-white/10 dark:shadow-[0_18px_40px_rgba(0,0,0,0.55)] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <nav aria-label="Mobile">
          <ul>
            {siteConfig.nav.map((link, index) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href} {...item(index)}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`${rowClass} ${
                      active ? "bg-surface-muted text-accent dark:bg-white/8" : idleRow
                    }`}
                  >
                    <TabIcon src={TAB_ICONS[link.href]} />
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className="size-4 opacity-40" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mx-3 my-1.5 h-px bg-border dark:bg-white/10" />

        <div {...item(navCount)}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
            className={`${rowClass} ${idleRow}`}
          >
            <Search className="size-[18px]" strokeWidth={1.9} />
            <span className="flex-1">Search</span>
          </button>
        </div>

        <div {...item(navCount + 1)}>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => setAppearance(isDark ? "light" : "dark")}
            className={`${rowClass} ${idleRow}`}
          >
            {isDark ? (
              <Sun className="size-[18px]" strokeWidth={1.9} />
            ) : (
              <Moon className="size-[18px]" strokeWidth={1.9} />
            )}
            <span className="flex-1">Dark mode</span>
            <span
              aria-hidden
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                isDark ? "bg-white" : "bg-black/15"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform duration-300 ${EASE} ${
                  isDark ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                }`}
              />
            </span>
          </button>
        </div>

        <div {...item(navCount + 2)}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              gate(() => router.push("/profile"), true);
            }}
            className={`${rowClass} ${idleRow}`}
          >
            <span className="size-7 shrink-0 overflow-hidden rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.22)]">
              <Image
                src="/images/profile-avatar-3d.png"
                alt=""
                width={56}
                height={56}
                className="size-full object-cover"
              />
            </span>
            <span className="flex-1">Profile</span>
            <ChevronRight className="size-4 opacity-40" aria-hidden />
          </button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      {modal}
    </>
  );
}
