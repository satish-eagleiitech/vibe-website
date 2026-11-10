import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { activityExploreCategories } from "@/lib/data/activityCategories";

export function ExploreActivitiesSection() {
  return (
    <ExploreCategoryRail
      bare
      sectionId="explore-activities"
      title="Explore Activities"
      items={activityExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: `/images/explore/activities/clay/${category.id}.png?v=1`,
        imageClassName: "object-contain object-center",
      }))}
    />
  );
}
