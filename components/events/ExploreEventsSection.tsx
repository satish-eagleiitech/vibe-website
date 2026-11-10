import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { eventExploreCategories } from "@/lib/data/eventCategories";

export function ExploreEventsSection() {
  return (
    <ExploreCategoryRail
      bare
      sectionId="explore-events"
      title="Explore Events"
      items={eventExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: `/images/explore/events/clay/${category.id}.png?v=4`,
        imageClassName: "object-contain object-center",
      }))}
    />
  );
}
