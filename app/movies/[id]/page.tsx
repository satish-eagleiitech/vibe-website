import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { BookTicketsButton } from "@/components/movies/BookTicketsButton";
import { MovieDetailPhotosGrid } from "@/components/movies/MovieDetailPhotosGrid";
import { MoviePeopleRail } from "@/components/movies/MoviePeopleRail";
import { MovieTrailersRail } from "@/components/movies/MovieTrailersRail";
import { StickyBookBar } from "@/components/movies/StickyBookBar";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { getMovieById } from "@/lib/api/movies";

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
  const director =
    crew.find((person) => /director/i.test(person.role ?? ""))?.name ??
    crew[0]?.name;

  const wallpapers =
    movie.images?.filter((image) => image.type === "backdrop") ??
    (movie.backdropUrl
      ? [{ url: movie.backdropUrl, type: "backdrop" as const, alt: movie.title }]
      : []);
  const posters =
    movie.images?.filter((image) => image.type === "poster") ?? [];
  const galleryImages = [...wallpapers, ...posters];
  const art = movie.backdropUrl || movie.posterUrl;
  const language = movie.languages[0]
    ? movie.languages[0].charAt(0).toUpperCase() + movie.languages[0].slice(1)
    : "";
  const facts = [movie.certification, language, movie.duration].filter(Boolean);
  const releaseLabel = formatRelease(movie.releaseDate);

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

      <section id="movie-detail-hero" className="relative isolate min-h-[calc(480px+var(--vybe-header-h))] overflow-hidden bg-black text-white md:min-h-[calc(560px+var(--vybe-header-h))]">
        {art ? (
          <Image
            src={art}
            alt=""
            fill
            priority
            className="object-cover object-[78%_center]"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
        <Container className="relative flex min-h-[calc(480px+var(--vybe-header-h))] items-center justify-between gap-6 pt-[calc(var(--vybe-header-h)+2.5rem)] pb-10 md:min-h-[calc(560px+var(--vybe-header-h))] md:gap-10 md:pb-14">
          <div className="min-w-0 max-w-[640px] flex-1">
            <h1 className="text-[40px] leading-none font-extrabold tracking-[-0.03em] text-white md:text-[56px]">
              {movie.title}
            </h1>
            {facts.length > 0 ? (
              <p className="mt-4 text-[15px] font-medium text-white/90 md:text-[16px]">
                {facts.join(" | ")}
              </p>
            ) : null}
            {movie.description ? (
              <p className="mt-4 line-clamp-5 max-w-[560px] text-[14px] leading-7 text-white/85 md:text-[15px]">
                {movie.description}
              </p>
            ) : null}
            {movie.genres.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
            {releaseLabel ? (
              <p className="mt-4 text-[14px] text-white/85">Releasing {releaseLabel}</p>
            ) : null}
            <BookTicketsButton
              href={`/movies/${movie.id}/book`}
              certification={movie.certification}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[16px] font-bold text-black transition-transform hover:scale-[1.02]"
            >
              Book Tickets
            </BookTicketsButton>
          </div>
          <div className="relative w-[132px] shrink-0 overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/20 sm:w-[180px] md:w-[220px] lg:w-[250px]">
            <div className="relative aspect-[2/3] bg-black/40">
              <Image
                src={movie.posterUrl}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="250px"
              />
            </div>
          </div>
        </Container>
      </section>

      <StickyBookBar
        title={movie.title}
        bookHref={`/movies/${movie.id}/book`}
        certification={movie.certification}
      />

      <section className="bg-bg py-8 md:py-10">
        <Container className="space-y-10">
          <MoviePeopleRail title="Cast" people={cast} kind="cast" />
          <MoviePeopleRail title="Crew" people={crew} kind="crew" />

          {videos.length > 0 ? (
            <MovieTrailersRail
              videos={videos}
              metaLine={
                [
                  ...cast.slice(0, 2).map((person) => person.name),
                  director,
                ]
                  .filter(Boolean)
                  .join(" | ") || undefined
              }
            />
          ) : null}
        </Container>
      </section>

      {galleryImages.length > 0 ? (
        <MovieDetailPhotosGrid title={movie.title} images={galleryImages} />
      ) : null}
    </div>
  );
}

function formatRelease(iso?: string) {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}


