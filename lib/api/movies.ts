import { hasMoviesApi } from "@/config/env";
import { apiGet, resolveTmdbImage } from "@/lib/api/client";
import { fallbackMovies, fallbackSpotlight } from "@/lib/data/fallback";
import { formatRuntime, formatVoteCount } from "@/lib/format";
import type {
  Movie,
  MovieDetails,
  MovieListResult,
  MoviePerson,
  MovieVideo,
} from "@/types/movie";
import type {
  TmdbGenreListResponse,
  TmdbMovieDetailsResponse,
  TmdbMovieListItem,
  TmdbPagedResponse,
} from "@/types/tmdb";

const LANGUAGE_TO_ISO: Record<string, string> = {
  telugu: "te",
  hindi: "hi",
  english: "en",
  tamil: "ta",
};

const ISO_TO_LANGUAGE: Record<string, string> = {
  te: "telugu",
  hi: "hindi",
  en: "english",
  ta: "tamil",
  ml: "malayalam",
  kn: "kannada",
};

let genreNames: Record<number, string> | null = null;

async function getGenreNames(): Promise<Record<number, string>> {
  if (genreNames) return genreNames;

  const payload = await apiGet<TmdbGenreListResponse>("/genre/movie/list", {
    movies: true,
    query: { language: "en-IN" },
    revalidate: 60 * 60 * 24,
  });

  genreNames = Object.fromEntries(
    payload.genres.map((genre) => [genre.id, genre.name]),
  );
  return genreNames;
}

function mapLanguage(iso?: string): string {
  if (!iso) return "";
  return ISO_TO_LANGUAGE[iso] ?? iso;
}

function indianCertification(details: TmdbMovieDetailsResponse): string | undefined {
  const groups = details.release_dates?.results ?? [];
  const india = groups.find((group) => group.iso_3166_1 === "IN") ?? groups[0];
  const certified = india?.release_dates.find((item) => item.certification);
  return certified?.certification || undefined;
}

function mapVideos(details: TmdbMovieDetailsResponse): MovieVideo[] {
  return (details.videos?.results ?? [])
    .filter((video) => video.site === "YouTube")
    .slice(0, 12)
    .map((video) => ({
      id: video.key,
      key: video.key,
      name: video.name,
      type: video.type,
      site: video.site,
      thumbnailUrl: `https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${video.key}`,
    }));
}

function trailerUrl(details: TmdbMovieDetailsResponse): string | undefined {
  const videos = mapVideos(details);
  const trailer =
    videos.find((video) => video.type === "Trailer") ?? videos[0];
  return trailer?.watchUrl;
}

function mapPeople(
  people:
    | Array<{
        id: number;
        name: string;
        character?: string;
        job?: string;
        profile_path: string | null;
      }>
    | undefined,
  roleKey: "character" | "job",
  limit: number,
): MoviePerson[] {
  return (people ?? []).slice(0, limit).map((person) => ({
    id: String(person.id),
    name: person.name,
    role: roleKey === "character" ? person.character : person.job,
    imageUrl: person.profile_path
      ? resolveTmdbImage(person.profile_path, "w185")
      : undefined,
  }));
}


function mapListMovie(
  raw: TmdbMovieListItem,
  genres: Record<number, string>,
  extras?: Partial<Movie>,
): Movie {
  return {
    id: String(raw.id),
    title: raw.title,
    posterUrl: resolveTmdbImage(raw.poster_path, "w500"),
    backdropUrl: resolveTmdbImage(raw.backdrop_path, "w1280"),
    rating: raw.vote_average || undefined,
    voteLabel: raw.vote_count ? formatVoteCount(raw.vote_count) : undefined,
    genres: (raw.genre_ids ?? [])
      .map((id) => genres[id])
      .filter(Boolean)
      .slice(0, 3),
    languages: [mapLanguage(raw.original_language)].filter(Boolean),
    description: raw.overview,
    releaseDate: raw.release_date || undefined,
    formatBadge: extras?.formatBadge,
    statusBadge: extras?.statusBadge,
    ...extras,
  };
}

function mapDetails(raw: TmdbMovieDetailsResponse): MovieDetails {
  const genres =
    raw.genres?.map((genre) => genre.name) ??
    (raw.genre_ids ?? []).map(String);

  const castMembers = mapPeople(raw.credits?.cast, "character", 18);
  const crewJobs = new Set(["Director", "Writer", "Screenplay", "Producer"]);
  const crew = mapPeople(
    raw.credits?.crew.filter((person) => crewJobs.has(person.job)),
    "job",
    12,
  );

  const videos = mapVideos(raw);
  const backdrops = (raw.images?.backdrops ?? [])
    .slice(0, 10)
    .map((image) => ({
      url: resolveTmdbImage(image.file_path, "w1280"),
      type: "backdrop" as const,
      alt: `${raw.title} backdrop`,
    }));
  const posters = (raw.images?.posters ?? []).slice(0, 8).map((image) => ({
    url: resolveTmdbImage(image.file_path, "w500"),
    type: "poster" as const,
    alt: `${raw.title} poster`,
  }));

  return {
    id: String(raw.id),
    title: raw.title,
    posterUrl: resolveTmdbImage(raw.poster_path, "w500"),
    backdropUrl: resolveTmdbImage(raw.backdrop_path, "w1280"),
    rating: raw.vote_average || undefined,
    voteLabel: raw.vote_count ? formatVoteCount(raw.vote_count) : undefined,
    certification: indianCertification(raw),
    genres,
    languages: raw.spoken_languages?.length
      ? raw.spoken_languages.map((item) => mapLanguage(item.iso_639_1))
      : [mapLanguage(raw.original_language)].filter(Boolean),
    duration: formatRuntime(raw.runtime),
    statusBadge: raw.status === "Released" ? "Now in theatres" : raw.status,
    description: raw.overview,
    synopsis: raw.overview,
    cast: castMembers.map((person) => person.name),
    castMembers,
    crew,
    videos,
    images: [...backdrops, ...posters],
    trailerUrl: trailerUrl(raw),
  };
}


async function fetchMoviePage(
  path: string,
  query?: Record<string, string | undefined>,
  extras?: Partial<Movie>,
  revalidate = 120,
): Promise<MovieListResult> {
  const [payload, genres] = await Promise.all([
    apiGet<TmdbPagedResponse<TmdbMovieListItem>>(path, {
      movies: true,
      query,
      revalidate,
    }),
    getGenreNames(),
  ]);

  const items = payload.results
    .filter((movie) => movie.poster_path)
    .map((movie) => mapListMovie(movie, genres, extras));

  return {
    items,
    total: payload.total_results,
    source: "api",
  };
}

async function fetchMoviePages(
  path: string,
  pages: number,
  query?: Record<string, string | undefined>,
  extras?: Partial<Movie>,
  revalidate?: number,
): Promise<MovieListResult> {
  const results = await Promise.all(
    Array.from({ length: pages }, (_, index) =>
      fetchMoviePage(path, { ...query, page: String(index + 1) }, extras, revalidate),
    ),
  );

  const seen = new Set<string>();
  const items: Movie[] = [];
  for (const page of results) {
    for (const movie of page.items) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      items.push(movie);
    }
  }

  return {
    items,
    total: results[0]?.total ?? items.length,
    source: "api",
  };
}

function isoDaysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/** TMDB's now_playing also lists re-releases (e.g. 2019 titles); keep only recent ones. */
function releasedSince(items: Movie[], days: number): Movie[] {
  const cutoff = isoDaysFromToday(-days);
  return items.filter((movie) => !movie.releaseDate || movie.releaseDate >= cutoff);
}

function newestFirst(items: Movie[]): Movie[] {
  return [...items].sort((a, b) =>
    (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""),
  );
}

function filterFallback(language?: string): Movie[] {
  if (!language || language === "all") return fallbackMovies;
  return fallbackMovies.filter((movie) =>
    movie.languages.some((item) => item.toLowerCase() === language.toLowerCase()),
  );
}

export async function getMovies(language?: string): Promise<MovieListResult> {
  return getTrendingMovies(language);
}

export async function getTrendingMovies(
  language?: string,
): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    const items = filterFallback(language);
    return { items, total: items.length, source: "fallback" };
  }

  try {
    const iso = language ? LANGUAGE_TO_ISO[language.toLowerCase()] : undefined;

    if (iso) {
      const result = await fetchMoviePage(
        "/discover/movie",
        {
          with_original_language: iso,
          sort_by: "popularity.desc",
          "primary_release_date.gte": isoDaysFromToday(-120),
          "primary_release_date.lte": isoDaysFromToday(0),
          region: "IN",
          include_adult: "false",
        },
        { formatBadge: "Now Playing" },
      );
      return { ...result, items: newestFirst(result.items) };
    }

    const result = await fetchMoviePages(
      "/movie/now_playing",
      2,
      { region: "IN", language: "en-IN" },
      { formatBadge: "Now Playing" },
    );
    return { ...result, items: newestFirst(releasedSince(result.items, 90)) };
  } catch {
    const items = filterFallback(language);
    return { items, total: items.length, source: "fallback" };
  }
}

export async function getNowShowingMovies(
  language?: string,
): Promise<MovieListResult> {
  return getTrendingMovies(language);
}

export async function getUpcomingMovies(
  language?: string,
): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    return { items: fallbackMovies, source: "fallback" };
  }

  try {
    const iso = language ? LANGUAGE_TO_ISO[language.toLowerCase()] : undefined;
    if (iso) {
      return await fetchMoviePage("/discover/movie", {
        with_original_language: iso,
        sort_by: "primary_release_date.asc",
        "primary_release_date.gte": isoDaysFromToday(1),
        region: "IN",
        include_adult: "false",
      });
    }

    return await fetchMoviePage(
      "/movie/upcoming",
      { region: "IN", language: "en-IN" },
      { formatBadge: "Upcoming" },
    );
  } catch {
    return { items: fallbackMovies, source: "fallback" };
  }
}

const REGIONAL_LANGUAGES = ["telugu", "hindi", "english"] as const;

async function genreIdByName(name: string): Promise<number | undefined> {
  const genres = await getGenreNames();
  const match = Object.entries(genres).find(
    ([, label]) => label.toLowerCase() === name.toLowerCase(),
  );
  return match ? Number(match[0]) : undefined;
}

function mergeUniqueMovieLists(lists: Movie[][], limit?: number): Movie[] {
  const seen = new Set<string>();
  const items: Movie[] = [];
  for (const list of lists) {
    for (const movie of list) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      items.push(movie);
    }
  }
  return limit ? items.slice(0, limit) : items;
}

/** Round-robin Telugu → Hindi → English so the grid is not English-heavy at the top. */
export function interleaveRegionalMovies(
  telugu: Movie[],
  hindi: Movie[],
  english: Movie[],
  limit: number,
): Movie[] {
  const lists = [
    newestFirst(telugu),
    newestFirst(hindi),
    newestFirst(english),
  ];
  const pointers = [0, 0, 0];
  const seen = new Set<string>();
  const items: Movie[] = [];

  while (items.length < limit) {
    let progress = false;
    for (let lang = 0; lang < lists.length; lang++) {
      const list = lists[lang];
      while (pointers[lang] < list.length && seen.has(list[pointers[lang]].id)) {
        pointers[lang]++;
      }
      if (pointers[lang] >= list.length) continue;
      const movie = list[pointers[lang]++];
      seen.add(movie.id);
      items.push(movie);
      progress = true;
      if (items.length >= limit) break;
    }
    if (!progress) break;
  }

  return items;
}

/** Top rated Telugu, Hindi, and English titles (not global-only Hollywood). */
export async function getTopRatedMovies(limit = 45): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    const items = filterFallback(undefined)
      .filter((movie) =>
        REGIONAL_LANGUAGES.some((lang) =>
          movie.languages.some((item) => item.toLowerCase() === lang),
        ),
      )
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);
    return { items, total: items.length, source: "fallback" };
  }

  try {
    const perLanguage = await Promise.all(
      REGIONAL_LANGUAGES.map((lang) =>
        fetchMoviePages(
          "/discover/movie",
          2,
          {
            with_original_language: LANGUAGE_TO_ISO[lang],
            sort_by: "vote_average.desc",
            "vote_count.gte": "80",
            region: "IN",
            include_adult: "false",
            language: "en-IN",
          },
          undefined,
          300,
        ),
      ),
    );

    const items = mergeUniqueMovieLists(perLanguage.map((result) => result.items))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, limit);

    return { items, total: items.length, source: "api" };
  } catch {
    const items = filterFallback(undefined).slice(0, limit);
    return { items, total: items.length, source: "fallback" };
  }
}

/** Genre rail focused on Telugu, Hindi, and English catalogues. */
export async function getMoviesByGenre(
  genreName: string,
  limit = 40,
): Promise<MovieListResult> {
  const genreId = await genreIdByName(genreName);
  if (!genreId) {
    return { items: [], total: 0, source: hasMoviesApi() ? "api" : "fallback" };
  }

  if (!hasMoviesApi()) {
    const items = filterFallback(undefined)
      .filter((movie) => movie.genres.includes(genreName))
      .slice(0, limit);
    return { items, total: items.length, source: "fallback" };
  }

  try {
    const perLanguage = await Promise.all(
      REGIONAL_LANGUAGES.map((lang) =>
        fetchMoviePages("/discover/movie", 2, {
          with_original_language: LANGUAGE_TO_ISO[lang],
          with_genres: String(genreId),
          sort_by: "popularity.desc",
          region: "IN",
          include_adult: "false",
          language: "en-IN",
        }),
      ),
    );

    const items = mergeUniqueMovieLists(
      perLanguage.map((result) => result.items),
      limit,
    );

    return { items, total: items.length, source: "api" };
  } catch {
    return { items: [], total: 0, source: "fallback" };
  }
}

/** Catalog for /movies — enough cards for the full grid (≈60). */
export async function getMoviesCatalog(
  language?: string,
  limit = 60,
): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    const items = filterFallback(language);
    return { items, total: items.length, source: "fallback" };
  }

  try {
    const iso = language ? LANGUAGE_TO_ISO[language.toLowerCase()] : undefined;
    const pages = Math.max(3, Math.ceil(limit / 20));

    const recentWindow = {
      sort_by: "popularity.desc",
      "primary_release_date.gte": isoDaysFromToday(-365),
      "primary_release_date.lte": isoDaysFromToday(0),
      region: "IN",
      include_adult: "false",
      language: "en-IN",
    };

    if (iso) {
      const result = await fetchMoviePages("/discover/movie", pages, {
        ...recentWindow,
        with_original_language: iso,
      });
      return { ...result, items: newestFirst(result.items).slice(0, limit) };
    }

    const perLanguage = await Promise.all(
      REGIONAL_LANGUAGES.map((lang) =>
        fetchMoviePages("/discover/movie", pages, {
          ...recentWindow,
          with_original_language: LANGUAGE_TO_ISO[lang],
        }),
      ),
    );

    const perList = perLanguage.map((result) => newestFirst(result.items));
    const items = interleaveRegionalMovies(
      perList[0] ?? [],
      perList[1] ?? [],
      perList[2] ?? [],
      limit,
    );

    return {
      items,
      total: items.length,
      source: "api",
    };
  } catch {
    const items = filterFallback(language);
    return { items, total: items.length, source: "fallback" };
  }
}

const DAY_SECONDS = 60 * 60 * 24;

/**
 * Newest theatrical releases in one original language, latest first.
 * Picks the most popular titles of the last 90 days (a pure date sort surfaces
 * thousands of obscure indie releases), then orders them by release date.
 */
async function fetchNewReleasesFor(
  iso: string,
  pages: number,
  extras?: Partial<Movie>,
  revalidate?: number,
): Promise<MovieListResult> {
  const result = await fetchMoviePages(
    "/discover/movie",
    pages,
    {
      sort_by: "popularity.desc",
      "primary_release_date.gte": isoDaysFromToday(-90),
      "primary_release_date.lte": isoDaysFromToday(0),
      region: "IN",
      with_release_type: "2|3",
      include_adult: "false",
      language: "en-IN",
      with_original_language: iso,
    },
    extras,
    revalidate,
  );
  return { ...result, items: newestFirst(result.items) };
}

export async function getNewReleaseMovies(
  language?: string,
): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    return { items: filterFallback(language), source: "fallback" };
  }

  try {
    const iso =
      language && language !== "all"
        ? LANGUAGE_TO_ISO[language.toLowerCase()]
        : undefined;

    if (iso) {
      return await fetchNewReleasesFor(iso, 2, { formatBadge: "New" });
    }

    const [telugu, hindi, english] = await Promise.all([
      fetchNewReleasesFor(LANGUAGE_TO_ISO.telugu, 1, { formatBadge: "New Release" }),
      fetchNewReleasesFor(LANGUAGE_TO_ISO.hindi, 1, { formatBadge: "New Release" }),
      fetchNewReleasesFor(LANGUAGE_TO_ISO.english, 1, { formatBadge: "New Release" }),
    ]);
    const items = interleaveRegionalMovies(
      telugu.items,
      hindi.items,
      english.items,
      24,
    );
    return { items, total: items.length, source: "api" };
  } catch {
    return { items: filterFallback(language), source: "fallback" };
  }
}

const HERO_MIX = [
  { iso: "te", count: 4, badge: "Tollywood" },
  { iso: "hi", count: 3, badge: "Bollywood" },
  { iso: "en", count: 3, badge: "Hollywood" },
] as const;

/**
 * Landing hero: latest 4 Tollywood, 3 Bollywood and 3 Hollywood releases.
 * Cached for 24 hours so newly released titles rotate in daily.
 */
export async function getLandingHeroMovies(): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    return { items: fallbackMovies.slice(0, 10), source: "fallback" };
  }

  try {
    const groups = await Promise.all(
      HERO_MIX.map(({ iso, badge }) =>
        fetchNewReleasesFor(iso, 1, { formatBadge: badge }, DAY_SECONDS),
      ),
    );
    const items = HERO_MIX.flatMap(({ count }, index) =>
      groups[index].items.filter((movie) => movie.posterUrl).slice(0, count),
    );
    return { items, total: items.length, source: "api" };
  } catch {
    return { items: fallbackMovies.slice(0, 10), source: "fallback" };
  }
}

export async function getSpotlightMovies(): Promise<MovieListResult> {
  if (!hasMoviesApi()) {
    return { items: fallbackSpotlight, source: "fallback" };
  }

  try {
    const trending = await fetchMoviePage("/trending/movie/week", {
      language: "en-IN",
    });

    const featured = trending.items
      .filter((movie) => movie.backdropUrl)
      .slice(0, 3);

    const detailed = await Promise.all(
      featured.map(async (movie, index) => {
        const details = await getMovieById(movie.id);
        return {
          ...(details ?? movie),
          statusBadge:
            details?.statusBadge ||
            movie.statusBadge ||
            (index === 0 ? "Now in theatres" : "In the spotlight"),
        };
      }),
    );

    return { items: detailed, total: trending.total, source: "api" };
  } catch {
    return { items: fallbackSpotlight, source: "fallback" };
  }
}

export async function getMovieById(id: string): Promise<MovieDetails | null> {
  if (!hasMoviesApi()) {
    return (
      [...fallbackMovies, ...fallbackSpotlight].find((item) => item.id === id) ??
      null
    );
  }

  try {
    return mapDetails(
      await apiGet<TmdbMovieDetailsResponse>(`/movie/${id}`, {
        movies: true,
        query: {
          language: "en-IN",
          append_to_response: "credits,release_dates,videos,images",
          include_image_language: "en,null",
        },
        revalidate: 300,
      }),
    );
  } catch {
    return null;
  }
}

export async function searchMovies(query: string): Promise<MovieListResult> {
  const q = query.trim();
  if (!q) return { items: [], source: hasMoviesApi() ? "api" : "fallback" };

  if (!hasMoviesApi()) {
    const items = fallbackMovies.filter((movie) =>
      movie.title.toLowerCase().includes(q.toLowerCase()),
    );
    return { items, source: "fallback" };
  }

  try {
    return await fetchMoviePage("/search/movie", {
      query: q,
      include_adult: "false",
      region: "IN",
      language: "en-IN",
    });
  } catch {
    return { items: [], source: "fallback" };
  }
}
