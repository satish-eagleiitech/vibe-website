import { notFound } from "next/navigation";
import { EventCheckoutPanel } from "@/components/events/EventCheckoutPanel";
import { getEventById } from "@/lib/api/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Checkout · ${event.title}` : "Checkout" };
}

export default async function EventCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    date?: string;
    time?: string;
    tier?: string;
    qty?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const event = await getEventById(id);
  if (!event) notFound();

  const qty = Number.parseInt(query.qty ?? "1", 10);

  return (
    <EventCheckoutPanel
      event={event}
      dateIso={query.date ?? ""}
      timeLabel={query.time ?? "6:00 – 10:00 PM"}
      tierId={query.tier ?? "silver"}
      qty={Number.isFinite(qty) ? qty : 1}
    />
  );
}
