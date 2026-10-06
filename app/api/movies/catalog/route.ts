import { NextRequest, NextResponse } from "next/server";
import {
  getMoviesByGenre,
  getMoviesCatalog,
  getTopRatedMovies,
} from "@/lib/api/movies";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const genre = params.get("genre");
  const topRated = params.get("topRated");
  const language = params.get("language");
  const limit = Math.min(Number(params.get("limit") ?? 40), 60);

  if (genre) {
    const result = await getMoviesByGenre(genre, limit);
    return NextResponse.json(result);
  }

  if (topRated === "1" || topRated === "true") {
    const result = await getTopRatedMovies(limit);
    return NextResponse.json(result);
  }

  const result = await getMoviesCatalog(language ?? undefined, limit);
  return NextResponse.json(result);
}
