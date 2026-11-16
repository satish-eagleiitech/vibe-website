import { notFound } from "next/navigation";
import { FoodBeveragesPanel } from "@/components/movies/FoodBeveragesPanel";
import { getMovieById } from "@/lib/api/movies";
import { buildSeatMap, getBookingDates } from "@/lib/data/booking";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie ? `Food · ${movie.title}` : "Food & beverages" };
}

export default async function FoodPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    theatre?: string;
    show?: string;
    date?: string;
    seats?: string;
    lang?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  const seatIds = (query.seats ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!seatIds.length || !query.show || !query.theatre) notFound();

  const map = buildSeatMap(query.show);
  const seats = map.seats.filter((seat) => seatIds.includes(seat.id));
  const ticketTotal = seats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <FoodBeveragesPanel
      movie={movie}
      theatreId={query.theatre}
      showId={query.show}
      dateIso={query.date || getBookingDates(1)[0]?.iso || ""}
      seatIds={seatIds}
      language={query.lang}
      ticketTotal={ticketTotal}
    />
  );
}
