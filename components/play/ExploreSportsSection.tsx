import { ExploreCategoryRail } from "@/components/common/ExploreCategoryRail";
import { playSports } from "@/lib/data/playSports";

const sceneSports = new Set([
  "turf-football",
  "box-cricket",
  "cricket-nets",
  "football",
  "cricket",
]);

export function ExploreSportsSection() {
  return (
    <ExploreCategoryRail
      title="Explore Sports"
      items={playSports.map((sport) => ({
        id: sport.id,
        label: sport.label,
        href: sport.href,
        imageUrl: sport.imageUrl,
        imageClassName: sceneSports.has(sport.id)
          ? "object-cover object-[center_68%]"
          : "origin-center object-contain object-center scale-[1.12]",
      }))}
    />
  );
}
