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
  const [scrolled, setScrolled] = useState(false);
  const moviesBrowsePage = pathname === "/movies";
  const moviesDetailPage =
    pathname.startsWith("/movies/") &&
    !pathname.includes("/book") &&
    !pathname.includes("/seats") &&
    !pathname.includes("/checkout");
  const activitiesPage = pathname === "/activities";
  const diningPage = pathname === "/dining";
  const seamlessHeroTop = diningPage || activitiesPage;
  /** Transparent nav over hero — movies browse only, not detail */
  const overlay = moviesBrowsePage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Below lg: brand row scrolls away, search + categories stay pinned */}
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

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border/80 bg-surface/95 shadow-[0_8px_24px_rgba(17,24,39,0.08)] backdrop-blur-xl"
            : "border-b border-border/60 bg-surface lg:border-transparent"
        } ${
          overlay
            ? "lg:border-transparent lg:bg-transparent lg:bg-gradient-to-b lg:from-black/55 lg:via-black/20 lg:to-transparent lg:shadow-none lg:backdrop-blur-none"
            : moviesDetailPage && !scrolled
              ? "lg:border-b lg:border-border/80 lg:bg-surface lg:shadow-none lg:backdrop-blur-none"
              : moviesBrowsePage && !scrolled
                ? "lg:border-border/80 lg:bg-surface/95 lg:backdrop-blur-xl"
                : scrolled
                  ? ""
                  : seamlessHeroTop
                    ? "lg:border-transparent lg:bg-bg lg:shadow-none"
                    : "lg:bg-bg"
        }`}
      >
        <div className="lg:hidden">
          <Container className="flex h-[60px] items-center">
            <Suspense fallback={null}>
              <SearchBar variant="mobile" />
            </Suspense>
          </Container>
          <MobileCategoryTabs />
        </div>

        <Container
          fullWidth
          className="hidden h-[60px] grid-cols-[1fr_auto_1fr] items-center gap-4 lg:grid"
        >
          <div className="flex min-w-0 items-center justify-start gap-8 xl:gap-10">
            <Logo priority overlay={overlay} />
            <LocationButton overlay={overlay} />
          </div>

          <NavLinks overlay={overlay} />

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Suspense fallback={null}>
              <SearchBar overlay={overlay} />
            </Suspense>
            <ThemeToggle overlay={overlay} />
            <NotificationButton overlay={overlay} />
            <ProfileLink overlay={overlay} />
          </div>
        </Container>
      </header>
    </>
  );
}
