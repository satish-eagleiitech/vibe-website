import { Suspense } from "react";
import { AllActivitiesSection } from "@/components/activities/AllActivitiesSection";
import { ExploreActivitiesSection } from "@/components/activities/ExploreActivitiesSection";
import { TrendingActivitiesSection } from "@/components/activities/TrendingActivitiesSection";
import { getActivities } from "@/lib/api/activities";

export const metadata = {
  title: "Activities",
};

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; when?: string }>;
}) {
  const { category, when } = await searchParams;
  const result = await getActivities();

  return (
    <div className="w-full pb-12">
      <ExploreActivitiesSection />
      <TrendingActivitiesSection activities={result.items} />
      <Suspense fallback={null}>
        <AllActivitiesSection
          activities={result.items}
          category={category}
          when={when}
        />
      </Suspense>
    </div>
  );
}
