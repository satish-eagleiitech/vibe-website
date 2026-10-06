import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { DiningCarousel } from "@/components/dining/DiningCard";
import type { DiningSpot } from "@/types/dining";

type DiningSectionProps = {
  spots: DiningSpot[];
};

export function DiningSection({ spots }: DiningSectionProps) {
  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Dining
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Reserve tables at the best spots near you
            </p>
          </div>
          <Link
            href="/dining"
            className="inline-flex items-center gap-1 text-[15px] font-bold text-accent"
          >
            See all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {spots.length === 0 ? (
          <EmptyState title="No dining spots yet" />
        ) : (
          <DiningCarousel spots={spots} />
        )}
      </Container>
    </section>
  );
}
