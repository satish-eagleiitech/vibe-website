/**
 * Domain models used by VYBE UI.
 * Mapped from TMDB v3 in `lib/api/movies.ts` (`types/tmdb.ts`).
 */
export type MovieLanguage = "telugu" | "hindi" | "english" | "tamil" | string;

export type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  rating?: number;
  voteLabel?: string;
  certification?: string;
  genres: string[];
  languages: MovieLanguage[];
  duration?: string;
  formatBadge?: string;
  statusBadge?: string;
  description?: string;
  cast?: string[];
  /** ISO date (YYYY-MM-DD) */
  releaseDate?: string;
};

export type MovieDetails = Movie & {
  synopsis?: string;
  trailerUrl?: string;
  castMembers?: MoviePerson[];
  crew?: MoviePerson[];
  videos?: MovieVideo[];
  images?: MovieImage[];
  theatres?: MovieTheatre[];
};

export type MovieImage = {
  url: string;
  type?: "poster" | "backdrop" | "still";
  alt?: string;
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
  thumbnailUrl: string;
  watchUrl: string;
};

export type MovieRating = {
  value: number;
  countLabel?: string;
  source?: string;
};

export type MovieGenre = {
  id: string;
  name: string;
};

export type MoviePerson = {
  id: string;
  name: string;
  role?: string;
  imageUrl?: string;
};

/** @deprecated use MoviePerson */
export type MovieCast = MoviePerson;
/** @deprecated use MoviePerson */
export type MovieCrew = MoviePerson;

export type MovieTheatre = {
  id: string;
  name: string;
  area?: string;
  city?: string;
  distanceKm?: number;
  cancellable?: boolean;
  brand?: string;
  showtimes?: MovieShowtime[];
};

export type MovieShowtime = {
  id: string;
  startsAt: string;
  label: string;
  format?: string;
  language?: string;
  status?: "available" | "filling" | "almost";
};

export type MovieListResult = {
  items: Movie[];
  total?: number;
  source: "api" | "fallback";
};
