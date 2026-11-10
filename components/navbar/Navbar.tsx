"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { TopDock } from "@/components/navbar/TopDock";

export function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  /** Cinematic heroes sit under the fixed nav instead of below a spacer */
  const darkHeroPage =
    pathname === "/" ||
    /^\/movies\/[^/]+$/.test(pathname) ||
    /^\/movies\/[^/]+\/seats$/.test(pathname);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const sync = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--vybe-header-h", `${h}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="vybe-site-header pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <TopDock />
      </header>

      {/* Fixed bar covers the top; keep page content below it except on the landing hero */}
      {!darkHeroPage ? (
        <div className="h-(--vybe-header-h)" aria-hidden />
      ) : null}
    </>
  );
}
