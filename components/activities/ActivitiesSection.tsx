import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityCarousel } from "@/components/activities/ActivityCard";
import type { Activity } from "@/types/activity";

type ActivitiesSectionProps = {
  activities: Activity[];
};

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <section className="w-full py-8 md:py-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Activities
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Try fun experiences near you
            </p>
          </div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-1 text-[15px] font-bold text-accent"
          >
            See all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {activities.length === 0 ? (
          <EmptyState title="No activities yet" />
        ) : (
          <ActivityCarousel activities={activities} />
        )}
      </Container>
    </section>
  );
}
