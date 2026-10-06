import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/api/movies";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const result = await searchMovies(query);
  return NextResponse.json(result);
}
