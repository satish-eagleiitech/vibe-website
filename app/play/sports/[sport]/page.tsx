import { notFound } from "next/navigation";
import { PlaySportListing } from "@/components/play/PlaySportListing";
import { getPlaySportVenues } from "@/lib/api/play";
import { findPlaySport, playSports } from "@/lib/data/playSports";

export function generateStaticParams() {
  return playSports.map((entry) => ({ sport: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const entry = findPlaySport(sport);
  return { title: entry ? `${entry.listingTitle} in Hyderabad` : "Play" };
}

export default async function PlaySportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  const entry = findPlaySport(sport);
  if (!entry) notFound();

  const venues = (await getPlaySportVenues(entry.id)).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

  return <PlaySportListing sport={entry} venues={venues} />;
}
