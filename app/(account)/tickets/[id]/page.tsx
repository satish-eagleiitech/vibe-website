import { TicketDetailView } from "@/components/bookings/TicketDetailView";

export const metadata = {
  title: "Ticket",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketDetailView id={id} />;
}
