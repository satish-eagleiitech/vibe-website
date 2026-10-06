import { notFound } from "next/navigation";
import { SeatPicker } from "@/components/movies/SeatPicker";
import { getMovieById } from "@/lib/api/movies";
import { getBookingDates } from "@/lib/data/booking";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie ? `Seats · ${movie.title}` : "Select seats" };
}

export default async function SeatsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ theatre?: string; show?: string; date?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  const dateIso = query.date || getBookingDates(1)[0]?.iso || "";
  const theatreId = query.theatre || "inox-gvk";
  const showId = query.show || "";

  if (!showId) notFound();

  return (
    <SeatPicker
      movie={movie}
      theatreId={theatreId}
      showId={showId}
      dateIso={dateIso}
    />
  );
}
