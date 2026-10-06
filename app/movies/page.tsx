import { MovieBrowser } from "@/components/movies/MovieBrowser";
import { MovieHeroCarousel } from "@/components/movies/MovieHeroCarousel";
import {
  getMoviesCatalog,
  getNewReleaseMovies,
  getTopRatedMovies,
  getTrendingMovies,
  interleaveRegionalMovies,
} from "@/lib/api/movies";

export const metadata = {
  title: "Movies",
};

export default async function MoviesPage() {
  const [hero, fresh, catalogTelugu, catalogHindi, catalogEnglish, topRated] =
    await Promise.all([
      getTrendingMovies(),
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

  return (
    <div className="w-full pb-12">
      <MovieHeroCarousel movies={hero.items.slice(0, 8)} />
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
