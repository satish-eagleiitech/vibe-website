import { AllEventsSection } from "@/components/events/AllEventsSection";
import { EventArtistsRow } from "@/components/events/EventArtistsRow";
// import { EventsHero } from "@/components/events/EventsHero";
import { ExploreEventsSection } from "@/components/events/ExploreEventsSection";
import { FeaturedEventsSection } from "@/components/events/FeaturedEventsSection";
import { getFeaturedArtists } from "@/lib/api/artists";
import { getUpcomingEvents } from "@/lib/api/events";

export const metadata = {
  title: "Events",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; when?: string }>;
}) {
  const { category, when } = await searchParams;

  const [eventsResult, artists] = await Promise.all([
    getUpcomingEvents(),
    getFeaturedArtists(),
  ]);

  const events = eventsResult.items;

  return (
    <div className="w-full pb-12">
      {/* <EventsHero events={events} /> */}
      <ExploreEventsSection />
      <FeaturedEventsSection events={events.slice(0, 10)} />
      <EventArtistsRow artists={artists} />
      <AllEventsSection
        events={events}
        category={category}
        when={when}
      />
    </div>
  );
}
