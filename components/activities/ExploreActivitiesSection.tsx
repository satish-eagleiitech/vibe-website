import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { activityExploreCategories } from "@/lib/data/activityCategories";

export function ExploreActivitiesSection() {
  return (
    <ExploreCategoryRail
      tone="charcoal"
      sectionId="explore-activities"
      title="Explore Activities"
      items={activityExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: `/images/explore/activities/on-dark/${category.id}.png`,
        imageClassName: "object-contain object-center",
      }))}
    />
  );
}
