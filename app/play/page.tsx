import { AllPlayVenuesSection } from "@/components/play/AllPlayVenuesSection";
import { ExploreSportsSection } from "@/components/play/ExploreSportsSection";
import { PlayEventsSection } from "@/components/play/PlayEventsSection";
import { PlayHeroCarousel } from "@/components/play/PlayHeroCarousel";
import { getPlayEvents, getPlayItems, getPlayVenues } from "@/lib/api/play";

export const metadata = {
  title: "Play",
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; near?: string }>;
}) {
  const { sport, near } = await searchParams;
  const [all, venues, events] = await Promise.all([
    getPlayItems(),
    getPlayVenues(),
    getPlayEvents(),
  ]);

  const heroItems = all.items.slice(0, 6);

  return (
    <div className="w-full pb-12">
      {/* <PlayHeroCarousel items={heroItems} /> */}
      <ExploreSportsSection />
      <PlayEventsSection events={events} />
      <AllPlayVenuesSection
        venues={[...venues, ...events]}
        sport={sport}
        near={near}
      />
    </div>
  );
}
