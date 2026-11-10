import { notFound } from "next/navigation";
import { EventCategoryView } from "@/components/events/EventCategoryView";
import { getUpcomingEvents } from "@/lib/api/events";
import { eventExploreCategories, findEventCategory } from "@/lib/data/eventCategories";

export function generateStaticParams() {
  return eventExploreCategories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = findEventCategory(id);
  return { title: category ? category.label : "Events" };
}

export default async function EventCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = findEventCategory(id);
  if (!category) notFound();

  const { items } = await getUpcomingEvents();
  const ids = new Set(category.subcategories.map((item) => item.eventId));
  const events = items.filter((event) => ids.has(event.id));

  return (
    <EventCategoryView
      category={category}
      categories={eventExploreCategories}
      events={events}
    />
  );
}
