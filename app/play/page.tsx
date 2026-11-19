import { Suspense } from "react";
import { AllPlayVenuesSection } from "@/components/play/AllPlayVenuesSection";
import { ExploreSportsSection } from "@/components/play/ExploreSportsSection";
import { PlayEventsSection } from "@/components/play/PlayEventsSection";
import { getPlayEvents, getPlayVenues } from "@/lib/api/play";

export const metadata = {
  title: "Play",
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; near?: string }>;
}) {
  const { sport, near } = await searchParams;
  const [venues, events] = await Promise.all([getPlayVenues(), getPlayEvents()]);

  return (
    <div className="w-full pb-12">
      <ExploreSportsSection />
      <PlayEventsSection events={events} />
      <Suspense fallback={null}>
        <AllPlayVenuesSection
          venues={[...venues, ...events]}
          sport={sport}
          near={near}
        />
      </Suspense>
    </div>
  );
}
