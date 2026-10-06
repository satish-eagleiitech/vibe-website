import { notFound } from "next/navigation";
import { CheckoutPanel } from "@/components/movies/CheckoutPanel";
import { getMovieById } from "@/lib/api/movies";
import { getBookingDates } from "@/lib/data/booking";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie ? `Checkout · ${movie.title}` : "Checkout" };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    theatre?: string;
    show?: string;
    date?: string;
    seats?: string;
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

  return (
    <CheckoutPanel
      movie={movie}
      theatreId={query.theatre || ""}
      showId={query.show || ""}
      dateIso={query.date || getBookingDates(1)[0]?.iso || ""}
      seatIds={seatIds}
    />
  );
}
