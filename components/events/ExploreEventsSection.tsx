import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { eventExploreCategories } from "@/lib/data/eventCategories";

export function ExploreEventsSection() {
  return (
    <ExploreCategoryRail
      tone="charcoal"
      sectionId="explore-events"
      title="Explore Events"
      items={eventExploreCategories.map((category) => ({
        id: category.id,
        label: category.label,
        href: category.href,
        imageUrl: `/images/explore/events/on-dark/${category.id}.png`,
        imageClassName: "object-contain object-center",
      }))}
    />
  );
}
