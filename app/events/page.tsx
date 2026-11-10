import { AllEventsSection } from "@/components/events/AllEventsSection";
// import { EventsHero } from "@/components/events/EventsHero";
import { ExploreEventsSection } from "@/components/events/ExploreEventsSection";
import { FeaturedEventsSection } from "@/components/events/FeaturedEventsSection";
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

  const eventsResult = await getUpcomingEvents();
  const events = eventsResult.items;

  return (
    <div className="w-full pb-12">
      {/* <EventsHero events={events} /> */}
      <ExploreEventsSection />
      <FeaturedEventsSection events={events.slice(0, 10)} />
      <AllEventsSection
        events={events}
        category={category}
        when={when}
      />
    </div>
  );
}
