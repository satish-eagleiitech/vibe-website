import { MovieBrowser } from "@/components/movies/MovieBrowser";
import { MovieHeroCarousel } from "@/components/movies/MovieHeroCarousel";
import {
  getMoviesCatalog,
  getNewReleaseMovies,
  getTopRatedMovies,
  interleaveRegionalMovies,
} from "@/lib/api/movies";

export const metadata = {
  title: "Movies",
};

const HERO_SLIDES = 10;

export default async function MoviesPage() {
  const [fresh, catalogTelugu, catalogHindi, catalogEnglish, topRated] =
    await Promise.all([
      getNewReleaseMovies(),
      getMoviesCatalog("telugu", 40),
      getMoviesCatalog("hindi", 40),
      getMoviesCatalog("english", 40),
      getTopRatedMovies(45),
    ]);

  const catalogAll = interleaveRegionalMovies(
    catalogTelugu.items,
    catalogHindi.items,
    catalogEnglish.items,
    60,
  );

  const heroMovies = fresh.items
    .filter((movie) => movie.backdropUrl && movie.description)
    .slice(0, HERO_SLIDES);

  return (
    <div className="w-full pb-12">
      <MovieHeroCarousel movies={heroMovies} />
      <MovieBrowser
        latest={fresh.items.slice(0, 16)}
        catalogs={{
          all: catalogAll,
          telugu: catalogTelugu.items,
          hindi: catalogHindi.items,
          english: catalogEnglish.items,
          topRated: topRated.items,
        }}
      />
    </div>
  );
}
