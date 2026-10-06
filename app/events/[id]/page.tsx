import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/events/EventDetailView";
import { getEventById, getUpcomingEvents } from "@/lib/api/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const { items: related } = await getUpcomingEvents();
  const moreEvents = related.filter((item) => item.id !== event.id).slice(0, 8);

  return <EventDetailView event={event} related={moreEvents} />;
}
