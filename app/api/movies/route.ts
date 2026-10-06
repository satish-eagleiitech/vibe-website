import { NextRequest, NextResponse } from "next/server";
import { getTrendingMovies } from "@/lib/api/movies";

export async function GET(request: NextRequest) {
  const language = request.nextUrl.searchParams.get("language") ?? undefined;
  const result = await getTrendingMovies(language);
  return NextResponse.json(result);
}
