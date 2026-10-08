import { notFound } from "next/navigation";
import { PlayDetailView } from "@/components/play/PlayDetailView";
import { getPlayById, getPlayVenues } from "@/lib/api/play";
import { isPlayVenue } from "@/lib/data/playSports";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPlayById(id);
  return { title: item?.title ?? "Play" };
}

export default async function PlayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPlayById(id);
  if (!item) notFound();

  const sport = item.sport?.toLowerCase();
  const related = (await getPlayVenues())
    .filter((venue) => venue.id !== item.id && isPlayVenue(venue))
    .sort(
      (a, b) =>
        Number(b.sport?.toLowerCase() === sport) -
        Number(a.sport?.toLowerCase() === sport),
    )
    .slice(0, 4);

  return <PlayDetailView item={item} related={related} />;
}
