import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { playSports } from "@/lib/data/playSports";

export function ExploreSportsSection() {
  return (
    <ExploreCategoryRail
      bare
      sectionId="explore-sports"
      title="Explore Sports"
      items={playSports.map((sport) => ({
        id: sport.id,
        label: sport.label,
        href: sport.href,
        imageUrl: `/images/explore/play/clay/${sport.id}.png?v=1`,
        imageClassName: "object-contain object-center",
      }))}
    />
  );
}
