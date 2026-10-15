import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { activityExploreCategories } from "@/lib/data/activityCategories";

export function ExploreActivitiesSection() {
  return (
    <ExploreCategoryRail
      sectionId="explore-activities"
      title="Explore Activities"
      items={activityExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: category.imageUrl,
      }))}
    />
  );
}
