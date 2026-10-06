import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { PlayCarousel } from "@/components/play/PlayCard";
import type { PlayItem } from "@/types/play";

type PlaySectionProps = {
  items: PlayItem[];
};

export function PlaySection({ items }: PlaySectionProps) {
  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Game Zone
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Bowling, VR, karting and arcade spots near you
            </p>
          </div>
          <Link
            href="/play"
            className="inline-flex items-center gap-1 text-[15px] font-bold text-accent"
          >
            See all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {items.length === 0 ? (
          <EmptyState title="No game zone spots yet" />
        ) : (
          <PlayCarousel items={items} />
        )}
      </Container>
    </section>
  );
}
