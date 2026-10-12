"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { LocationButton } from "@/components/navbar/LocationButton";
import { MobileCategoryTabs } from "@/components/navbar/MobileCategoryTabs";
import { NavLinks } from "@/components/navbar/NavLinks";
import { NotificationButton } from "@/components/navbar/NotificationButton";
import { ProfileLink } from "@/components/navbar/ProfileLink";
import { SearchBar } from "@/components/navbar/SearchBar";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  /** Only Movies browse has a full-bleed dark hero under the nav */
  const darkHeroPage = pathname === "/movies";
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

  const overlay = darkHeroPage && !onLight;
  const floating = onLight;

  return (
    <>
      {/* Mobile brand row */}
      <div className="bg-surface lg:hidden">
        <Container className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Logo priority />
            <LocationButton variant="stacked" />
          </div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <ThemeToggle />
            <NotificationButton />
            <ProfileLink />
          </div>
        </Container>
      </div>

      {/* Mobile sticky search + tabs */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface lg:hidden">
        <Container className="flex h-[60px] items-center">
          <Suspense fallback={null}>
            <SearchBar variant="mobile" />
          </Suspense>
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
            <NotificationButton overlay={overlay} />
            <ProfileLink overlay={overlay} />
          </div>
        </div>
      </header>
    </>
  );
}
