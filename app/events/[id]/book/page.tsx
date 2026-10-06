import { notFound } from "next/navigation";
import { BookEventTickets } from "@/components/events/BookEventTickets";
import { getEventById } from "@/lib/api/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Book · ${event.title}` : "Book tickets" };
}

export default async function BookEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();
  return <BookEventTickets event={event} />;
}
