import Image from "next/image";
import Link from "next/link";
import { Play, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";
import { MovieDetailPhotosGrid } from "@/components/movies/MovieDetailPhotosGrid";
import { MovieDetailPosterActions } from "@/components/movies/MovieDetailPosterActions";
import { MovieDetailScoreRing } from "@/components/movies/MovieDetailScoreRing";
import { StickyBookBar } from "@/components/movies/StickyBookBar";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { getMovieById } from "@/lib/api/movies";
import type { MoviePerson, MovieVideo } from "@/types/movie";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie?.title ?? "Movie" };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();

  const cast = movie.castMembers ?? [];
  const crew = movie.crew ?? [];
  const videos = movie.videos ?? [];
  const year = movie.releaseDate?.slice(0, 4);
  const director =
    crew.find((person) => /director/i.test(person.role ?? ""))?.name ??
    crew[0]?.name;
  const castLine =
    cast.length > 0
      ? cast
          .slice(0, 6)
          .map((person) => person.name)
          .join(", ")
      : (movie.cast ?? []).slice(0, 6).join(", ");

  const wallpapers =
    movie.images?.filter((image) => image.type === "backdrop") ??
    (movie.backdropUrl
      ? [{ url: movie.backdropUrl, type: "backdrop" as const, alt: movie.title }]
      : []);
  const posters =
    movie.images?.filter((image) => image.type === "poster") ?? [];
  const galleryImages = [...wallpapers, ...posters];
  const trailerHref =
    movie.trailerUrl ?? videos.find((v) => v.type === "Trailer")?.watchUrl;
  const featuredVideo = videos[0];

  const heroMeta = [
    year,
    movie.certification,
    "Movie",
    movie.duration,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={movie.id}
        title={movie.title}
        href={`/movies/${movie.id}`}
        imageUrl={movie.posterUrl}
        meta={movie.genres.slice(0, 2).join(" · ")}
        category="movies"
      />

      <section
        id="movie-detail-hero"
        className="relative min-h-[min(82vh,780px)] text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          {movie.backdropUrl ? (
            <Image
              src={movie.backdropUrl}
              alt=""
              fill
              priority
              className="object-cover object-[center_20%]"
              sizes="100vw"
            />
          ) : (
            <div className="size-full bg-[#0b0b0f]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/65 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-black/30" />
        </div>

        <Container className="relative z-10 flex min-h-[min(82vh,780px)] flex-col justify-end pb-10 pt-8 md:pb-12">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-accent uppercase">
            {movie.statusBadge || "Now showing"}
          </p>
          <h1 className="mt-2 max-w-4xl text-[34px] font-extrabold tracking-tight md:text-[48px] lg:text-[56px]">
            {movie.title}
          </h1>
          {heroMeta ? (
            <p className="mt-3 text-[14px] font-medium text-white/75 md:text-[15px]">
              {heroMeta}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/movies/${movie.id}/book`}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-7 py-3 text-sm font-bold text-text shadow-lg transition-transform hover:scale-[1.02]"
            >
              <Play className="size-4 fill-text" />
              Book seats
            </Link>
            {trailerHref ? (
              <a
                href={trailerHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md"
              >
                <Play className="size-4 fill-white" />
                Trailer
              </a>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="relative z-10 border-b border-border bg-bg py-8 md:py-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:items-start lg:gap-12">
            <MovieDetailPosterActions movie={movie} />

            <div className="min-w-0 space-y-5 text-[14px] md:text-[15px]">
              <MetaRow label="Title" value={movie.title} />
              {castLine ? <MetaRow label="Casts" value={castLine} /> : null}
              {director ? <MetaRow label="Creator" value={director} /> : null}
              {movie.genres.length > 0 ? (
                <div>
                  <p className="text-[13px] font-extrabold tracking-wide text-text uppercase">
                    Genre
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-border px-4 py-1.5 text-[13px] font-semibold text-text"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {movie.description ? (
                <p className="max-w-2xl pt-2 text-[14px] leading-7 text-text-secondary">
                  {movie.description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col items-center gap-6 lg:items-end">
              {movie.rating ? (
                <MovieDetailScoreRing value={movie.rating} />
              ) : null}
              {featuredVideo ? (
                <a
                  href={featuredVideo.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative w-full max-w-[220px] overflow-hidden rounded-2xl bg-surface-muted shadow-md"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="220px"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-white">
                        <Play className="size-5 fill-white" />
                      </span>
                    </span>
                  </div>
                  <p className="line-clamp-2 px-3 py-2.5 text-[12px] font-bold text-text">
                    {featuredVideo.name}
                  </p>
                </a>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {galleryImages.length > 0 ? (
        <MovieDetailPhotosGrid title={movie.title} images={galleryImages} />
      ) : null}

      <StickyBookBar
        title={movie.title}
        bookHref={`/movies/${movie.id}/book`}
      />

      <section className="bg-bg py-8 md:py-10">
        <Container className="space-y-10">
          {cast.length > 0 ? (
            <DetailScroller title="Cast">
              {cast.map((person) => (
                <PersonCard
                  key={`cast-${person.id}-${person.role}`}
                  person={person}
                />
              ))}
            </DetailScroller>
          ) : null}

          {crew.length > 0 ? (
            <DetailScroller title="Crew">
              {crew.map((person) => (
                <PersonCard
                  key={`crew-${person.id}-${person.role}`}
                  person={person}
                />
              ))}
            </DetailScroller>
          ) : null}

          {videos.length > 0 ? (
            <DetailScroller title="Trailers & Videos">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </DetailScroller>
          ) : null}
        </Container>
      </section>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] font-extrabold tracking-wide text-text uppercase">
        {label}:
      </p>
      <p className="mt-1 font-medium text-text-secondary">{value}</p>
    </div>
  );
}

function DetailScroller({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-4 text-[22px] font-extrabold tracking-tight text-text md:text-[26px]">
        {title}
      </h2>
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-1">
        {children}
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: MoviePerson }) {
  return (
    <div className="w-[100px] shrink-0 text-center md:w-[112px]">
      <div className="relative mx-auto size-[84px] overflow-hidden rounded-full bg-surface-muted md:size-[96px]">
        {person.imageUrl ? (
          <Image
            src={person.imageUrl}
            alt={person.name}
            fill
            className="object-cover object-top"
            sizes="96px"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-lg font-bold text-text-muted">
            {person.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-[13px] font-bold text-text">
        {person.name}
      </p>
      {person.role ? (
        <p className="truncate text-[11px] text-text-secondary">{person.role}</p>
      ) : null}
    </div>
  );
}

function VideoCard({ video }: { video: MovieVideo }) {
  return (
    <a
      href={video.watchUrl}
      target="_blank"
      rel="noreferrer"
      className="group w-[240px] shrink-0 md:w-[280px]"
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface-muted">
        <Image
          src={video.thumbnailUrl}
          alt={video.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="280px"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-white shadow-lg">
            <Play className="size-5 fill-white" />
          </span>
        </span>
        <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {video.type}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] font-bold text-text">
        {video.name}
      </p>
    </a>
  );
}
