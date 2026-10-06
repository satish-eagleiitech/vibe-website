"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { DiningCarousel } from "@/components/dining/DiningCard";
import type { DiningSpot } from "@/types/dining";

type NearbyDiningSectionProps = {
  spots: DiningSpot[];
  title?: string;
  anchorId?: string;
};

export function NearbyDiningSection({
  spots,
  title = "Restaurants near you",
  anchorId,
}: NearbyDiningSectionProps) {
  useEffect(() => {
    if (!anchorId) return;
    if (window.location.hash !== `#${anchorId}`) return;
    const el = document.getElementById(anchorId);
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [anchorId, title]);

  return (
    <section
      id={anchorId}
      className="w-full scroll-mt-[calc(var(--vybe-header-h)+1.5rem)] pt-6 pb-2 md:pt-8"
    >
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          {title}
        </h2>
        {spots.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No restaurants for this mood" />
          </div>
        ) : (
          <div className="mt-5">
            <DiningCarousel spots={spots} />
          </div>
        )}
      </Container>
    </section>
  );
}
