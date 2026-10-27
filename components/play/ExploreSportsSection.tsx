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
      tone="charcoal"
      title="Explore Sports"
      items={playSports.map((sport) => ({
        id: sport.id,
        label: sport.label,
        href: sport.href,
        imageUrl: sport.imageUrl,
        flushImage: sceneSports.has(sport.id),
        imageClassName: sceneSports.has(sport.id)
          ? "object-cover object-[center_68%]"
          : "object-contain object-center",
      }))}
    />
  );
}
