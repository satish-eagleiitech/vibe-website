import { notFound } from "next/navigation";
import { AdultBookingGate } from "@/components/movies/AdultBookingGate";
import { BookShowtimes } from "@/components/movies/BookShowtimes";
import { getMovieById } from "@/lib/api/movies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie ? `Book · ${movie.title}` : "Book seats" };
}

export default async function BookMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();
  return (
    <>
      <AdultBookingGate movieId={movie.id} certification={movie.certification} />
      <BookShowtimes movie={movie} />
    </>
  );
}
