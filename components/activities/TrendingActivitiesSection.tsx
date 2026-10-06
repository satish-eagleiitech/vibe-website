import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityCard } from "@/components/activities/ActivityCard";
import type { Activity } from "@/types/activity";

const TRENDING_ORDER = [
  "activity-wonderla",
  "activity-ramoji",
  "activity-water-slides",
  "activity-snowworld",
  "activity-bowling",
  "activity-trampoline",
  "activity-gokart",
  "activity-water-pirate",
  "activity-theme-night",
  "activity-pottery",
] as const;

function pickTrending(activities: Activity[]): Activity[] {
  const byId = new Map(activities.map((item) => [item.id, item]));
  const ordered: Activity[] = [];
  for (const id of TRENDING_ORDER) {
    const item = byId.get(id);
    if (item) ordered.push(item);
  }
  for (const item of activities) {
    if (ordered.length >= 10) break;
    if (!ordered.some((entry) => entry.id === item.id)) ordered.push(item);
  }
  return ordered.slice(0, 10);
}

type TrendingActivitiesSectionProps = {
  activities: Activity[];
};

export function TrendingActivitiesSection({
  activities,
}: TrendingActivitiesSectionProps) {
  const trending = pickTrending(activities);

  return (
    <section className="w-full py-6 md:py-8">
      <Container>
        <h2 className="text-[26px] font-extrabold tracking-tight text-text md:text-[30px]">
          Trending activities
        </h2>
        {trending.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No trending activities right now" />
          </div>
        ) : (
          <div className="mt-5 hide-scrollbar flex gap-5 overflow-x-auto pb-2">
            {trending.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
