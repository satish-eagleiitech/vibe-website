import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { LanguagePills } from "@/components/movies/LanguagePills";
import { MovieCard } from "@/components/movies/MovieCard";
import type { Movie } from "@/types/movie";

type TrendingMoviesProps = {
  movies: Movie[];
  language?: string;
  totalLabel?: string;
};

export function TrendingMovies({
  movies,
  language = "all",
  totalLabel = "View All",
}: TrendingMoviesProps) {
  return (
    <section className="w-full pt-5 pb-8 md:pt-6 md:pb-10">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-4 md:mb-7 md:flex-row md:items-end">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-tight text-text md:text-[34px]">
              Movies
            </h2>
            <p className="mt-1 text-[15px] text-text-secondary">
              Cinemas near you
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguagePills active={language} />
            <Link
              href="/movies"
              className="text-xs font-bold text-accent hover:underline"
            >
              {totalLabel}
            </Link>
          </div>
        </div>

        {movies.length === 0 ? (
          <EmptyState
            title="No movies for this filter"
            description="Try another language, or reconnect the movie API."
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
