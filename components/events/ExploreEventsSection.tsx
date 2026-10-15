import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { eventExploreCategories } from "@/lib/data/eventCategories";

export function ExploreEventsSection() {
  return (
    <ExploreCategoryRail
      sectionId="explore-events"
      title="Explore Events"
      items={eventExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: category.imageUrl,
      }))}
    />
  );
}
