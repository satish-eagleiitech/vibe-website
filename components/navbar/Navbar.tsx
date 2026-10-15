"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { LocationButton } from "@/components/navbar/LocationButton";
import { MobileCategoryTabs } from "@/components/navbar/MobileCategoryTabs";
import { NavLinks } from "@/components/navbar/NavLinks";
import { ProfileLink } from "@/components/navbar/ProfileLink";
import { SearchBar } from "@/components/navbar/SearchBar";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const mobileHeaderRef = useRef<HTMLElement>(null);
  /** Landing cinematic hero sits under the nav (movies browse starts without hero) */
  const darkHeroPage = pathname === "/";
  const [onLight, setOnLight] = useState(!darkHeroPage);

  useEffect(() => {
    const update = () => {
      if (!darkHeroPage) {
        setOnLight(true);
        return;
      }
      // Match vybe-web: white floating bar once past most of the hero.
      setOnLight(window.scrollY > Math.min(window.innerHeight * 0.55, 420));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [darkHeroPage]);

  // Keep --vybe-header-h in sync with the real sticky mobile/tablet bar (avoids gap above filters)
  useEffect(() => {
    const el = mobileHeaderRef.current;
    if (!el) return;

    const sync = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) {
        document.documentElement.style.setProperty("--vybe-header-h", "78px");
        return;
      }
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

  const overlay = darkHeroPage && !onLight;
  const floating = onLight;

  return (
    <>
      {/* Mobile / tablet — full-bleed sticky bar (edge to edge) */}
      <header
        ref={mobileHeaderRef}
        className="sticky top-0 z-50 w-full min-w-0 overflow-x-clip bg-surface lg:hidden"
      >
        <Container
          fullWidth
          className="flex h-14 max-w-none items-center justify-between gap-1.5 px-3 sm:gap-3 sm:px-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
            <Logo priority className="shrink-0 [&_img]:h-8 sm:[&_img]:h-9" />
            <LocationButton variant="stacked" className="min-w-0" />
          </div>
          <div className="flex shrink-0 items-center">
            <Suspense fallback={null}>
              <SearchBar variant="mobile" />
            </Suspense>
            <ThemeToggle />
            <ProfileLink />
          </div>
        </Container>
        <MobileCategoryTabs />
      </header>

      {/* Desktop spacer — fixed nav is out of flow; dark-hero pages use negative margin instead */}
      {!darkHeroPage ? (
        <div className="hidden h-[78px] lg:block" aria-hidden />
      ) : null}

      {/* Desktop — vybe-web site-nav style */}
      <header
        className={`pointer-events-none fixed inset-x-0 z-50 hidden transition-all duration-300 lg:block ${
          floating ? "top-3 px-4" : "top-0 px-0"
        }`}
      >
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1600px] items-center gap-6 px-7 transition-all duration-300 xl:gap-7 ${
            floating
              ? "h-[68px] rounded-[18px] bg-white shadow-[0_10px_30px_rgba(20,22,28,0.08)] dark:bg-surface dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              : "h-[78px] bg-transparent"
          }`}
        >
          <Logo priority overlay={overlay} />
          <LocationButton overlay={overlay} />
          <NavLinks overlay={overlay} />
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <Suspense fallback={null}>
              <SearchBar overlay={overlay} />
            </Suspense>
            <ThemeToggle overlay={overlay} />
            <ProfileLink overlay={overlay} />
          </div>
        </div>
      </header>
    </>
  );
}
