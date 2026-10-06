/**
 * TMDB v3 response types.
 * https://developer.themoviedb.org/reference/intro/getting-started
 */
export type TmdbMovieListItem = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids?: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date?: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbSpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type TmdbCast = {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_path: string | null;
};

export type TmdbCrew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TmdbCredits = {
  cast: TmdbCast[];
  crew: TmdbCrew[];
};

export type TmdbReleaseDate = {
  certification: string;
  iso_639_1?: string;
  release_date: string;
  type: number;
};

export type TmdbReleaseDates = {
  results: Array<{
    iso_3166_1: string;
    release_dates: TmdbReleaseDate[];
  }>;
};

export type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
  published_at?: string;
};

export type TmdbVideos = {
  results: TmdbVideo[];
};

export type TmdbImageFile = {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
};

export type TmdbImages = {
  backdrops: TmdbImageFile[];
  posters: TmdbImageFile[];
  logos?: TmdbImageFile[];
};

export type TmdbMovieDetailsResponse = TmdbMovieListItem & {
  genres?: TmdbGenre[];
  runtime?: number | null;
  tagline?: string;
  status?: string;
  spoken_languages?: TmdbSpokenLanguage[];
  credits?: TmdbCredits;
  release_dates?: TmdbReleaseDates;
  videos?: TmdbVideos;
  images?: TmdbImages;
};

export type TmdbGenreListResponse = {
  genres: TmdbGenre[];
};
