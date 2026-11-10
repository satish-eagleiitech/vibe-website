"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { BookTicketsButton } from "@/components/movies/BookTicketsButton";
import type { Movie, MoviePerson } from "@/types/movie";

type HeroMovie = Movie & { castMembers?: MoviePerson[] };

type MovieHeroCarouselProps = {
  movies: HeroMovie[];
};

function heroCast(movie: HeroMovie): MoviePerson[] {
  if (movie.castMembers?.length) return movie.castMembers;
  return (movie.cast ?? []).map((name, i) => ({
    id: `${movie.id}-cast-${i}`,
    name,
  }));
}

type SlideNav = { index: number; prev: number; dir: 1 | -1 };

const SLIDE_MS = 5000;

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Each file is 16:9 with black bars baked in. The frame is drawn tall enough
 * that those bars sit outside the full-screen hero and the picture fills it.
 * Doomsday picture is ~73% of the frame, Fauji ~74.5%, Jailer 2 ~94%.
 */
const DOOMSDAY_FRAME = { top: "-18.25%", height: "136.9%" };
const FAUJI_FRAME = { top: "-17.1%", height: "134.3%" };
const JAILER_FRAME = { top: "-3.7%", height: "107.3%" };

/**
 * Windows Chrome updates `muted` and `volume` but keeps outputting the audio
 * graph that started with the last play(). Silence has to be set before
 * play(), and a trailer that should stop has to leave the media pipeline.
 */
function markSilent(video: HTMLVideoElement) {
  video.defaultMuted = true;
  video.muted = true;
  video.setAttribute("muted", "");
  video.volume = 0;
  if (!video.muted) video.muted = true;
}

function markAudible(video: HTMLVideoElement) {
  video.defaultMuted = false;
  video.removeAttribute("muted");
  video.muted = false;
  video.volume = 1;
}

function releaseVideo(video: HTMLVideoElement) {
  markSilent(video);
  video.pause();
  video.removeAttribute("src");
  video.load();
}

/** Local hero trailers in public/trailers. */
function heroTrailer(movie: Movie): string | null {
  if (movie.id === "1003596" || /doomsday/i.test(movie.title)) {
    return "/trailers/dooms_day.mp4";
  }
  if (movie.id === "1257973" || /fau[jz]i/i.test(movie.title)) {
    return "/trailers/fauji.mp4";
  }
  if (movie.id === "1234139" || /jailer/i.test(movie.title)) {
    return "/trailers/jailer2.mp4";
  }
  return null;
}

function trailerFrame(src: string) {
  if (src.includes("fauji")) return FAUJI_FRAME;
  if (src.includes("jailer")) return JAILER_FRAME;
  return DOOMSDAY_FRAME;
}

export function MovieHeroCarousel({ movies }: MovieHeroCarouselProps) {
  const slides: HeroMovie[] = movies.filter((movie) => movie.backdropUrl || movie.posterUrl);
  const [nav, setNav] = useState<SlideNav>({ index: 0, prev: -1, dir: 1 });
  const [soundOn, setSoundOn] = useState(true);
  const [activeVideo, setActiveVideo] = useState<HTMLVideoElement | null>(null);
  const [clip, setClip] = useState(0);
  const remainingRef = useRef(SLIDE_MS);
  const soundRef = useRef(true);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const playGen = useRef(0);
  const resumeAt = useRef(0);
  const indexRef = useRef(0);
  const count = slides.length;
  const { index, prev, dir } = nav;
  indexRef.current = index;
  const slide = slides[index];
  const animating = prev >= 0;
  const activeTrailer = slide ? heroTrailer(slide) : null;

  const bindVideo = useCallback((node: HTMLVideoElement | null) => {
    activeVideoRef.current = node;
    setActiveVideo(node);
  }, []);

  const go = useCallback((direction: 1 | -1) => {
    resumeAt.current = 0;
    const current = activeVideoRef.current;
    if (current) {
      playGen.current += 1;
      releaseVideo(current);
    }
    setNav((cur) => ({
      index: (cur.index + direction + count) % count,
      prev: cur.index,
      dir: direction,
    }));
  }, [count]);

  useEffect(() => {
    remainingRef.current = SLIDE_MS;
  }, [index]);

  useEffect(() => {
    const video = activeVideo;
    if (!video) return;
    let alive = true;
    const gen = ++playGen.current;

    // Wait one turn so React's dev remount can cancel this before play().
    // A second play() on the same trailer is the doubled audio on load.
    const timer = window.setTimeout(() => {
      if (!alive || playGen.current !== gen) return;
      const src = video.dataset.src;
      if (!src) return;
      if (video.getAttribute("src") !== src) video.src = src;

      const start = () => {
        if (!alive || playGen.current !== gen) return;
        const seek = resumeAt.current;
        if (seek > 0.2) {
          try {
            video.currentTime = seek;
          } catch {
            /* metadata not ready */
          }
        }
        if (soundRef.current) markAudible(video);
        else markSilent(video);
        void video.play().then(() => {
          if (!alive || playGen.current !== gen) {
            releaseVideo(video);
            return;
          }
          if (soundRef.current) markAudible(video);
          else markSilent(video);
        }).catch((error: unknown) => {
          if (!alive || playGen.current !== gen) return;
          if (error instanceof DOMException && error.name === "AbortError") return;
          soundRef.current = false;
          setSoundOn(false);
          markSilent(video);
          void video.play().catch(() => {});
        });
      };

      if (video.readyState >= 1) start();
      else video.addEventListener("loadedmetadata", start, { once: true });
    }, 0);

    return () => {
      alive = false;
      window.clearTimeout(timer);
      playGen.current += 1;
      releaseVideo(video);
    };
  }, [activeVideo]);

  function toggleSound() {
    const video = activeVideoRef.current;
    if (video && video.currentTime > 0) resumeAt.current = video.currentTime;
    soundRef.current = !soundRef.current;
    setSoundOn(soundRef.current);
    // Replace the element. Muting the same node leaves the first audio graph running.
    if (video) {
      playGen.current += 1;
      releaseVideo(video);
    }
    setClip((n) => n + 1);
  }

  useEffect(() => {
    if (count < 2 || activeTrailer) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => go(1), remainingRef.current);
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
    };
  }, [index, count, activeTrailer, go]);

  if (!slide) return null;

  const layer = (i: number) => (i === index ? "z-[2]" : i === prev ? "z-[1]" : "z-0 opacity-0");
  const textStack = [prev, index].filter((i, n, all) => i >= 0 && all.indexOf(i) === n);

  return (
    <section
      className="relative hidden w-full overflow-hidden bg-black min-[426px]:block lg:-mt-[var(--vybe-header-h)]"
      style={{ "--exo-dir": dir } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="New movies"
    >
      <div className="relative h-svh w-full lg:h-[calc(100svh+var(--vybe-header-h))]">
        {slides.map((item, i) => {
          const trailer = heroTrailer(item);
          return (
          <div
            key={item.id}
            className={`absolute inset-0 bg-black ${layer(i)}`}
            aria-hidden={i !== index}
          >
            <div className={`absolute inset-0 overflow-hidden ${i === index && animating ? "exo-wipe" : ""}`}>
              {/* Full-bleed cover only — object-position shifts faces under nav without leaving a top gap (which leaked the previous slide on 4K) */}
              {trailer && i === index ? (
                <div
                  className="absolute left-1/2 aspect-video w-auto max-w-none -translate-x-1/2"
                  style={{ ...trailerFrame(trailer), minWidth: "100%" }}
                >
                  <video
                    key={`${trailer}-${clip}`}
                    ref={bindVideo}
                    data-src={trailer}
                    src={trailer}
                    poster={item.backdropUrl || item.posterUrl}
                    playsInline
                    preload="auto"
                    onPlay={(event) => {
                      const video = event.currentTarget;
                      if (!soundRef.current) markSilent(video);
                    }}
                    onVolumeChange={(event) => {
                      const video = event.currentTarget;
                      if (!soundRef.current && (video.volume !== 0 || !video.muted)) {
                        markSilent(video);
                      }
                    }}
                    className={`size-full object-cover ${
                      i === index && animating ? "exo-settle" : i === prev ? "exo-recede" : ""
                    }`}
                    onEnded={() => {
                      if (i === indexRef.current) go(1);
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={item.backdropUrl || item.posterUrl}
                  alt={`${item.title} backdrop`}
                  fill
                  priority={i === 0}
                  className={`object-cover object-[center_22%] lg:object-[center_28%] ${
                    i === index && animating ? "exo-settle" : i === prev ? "exo-recede" : ""
                  }`}
                  sizes="100vw"
                />
              )}
            </div>
          </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_right,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.32)_42%,rgba(0,0,0,0)_64%)]" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_top,rgba(0,0,0,0.6),rgba(0,0,0,0)_36%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="absolute top-1/2 right-[8vw] z-[4] hidden aspect-[2/3] w-[18vw] max-w-[300px] -translate-y-1/2 overflow-hidden rounded-xl bg-[#111] shadow-[0_40px_90px_rgba(0,0,0,0.35)] lg:block">
          {slides.map((item, i) => (
            <div
              key={item.id}
              className={`absolute inset-0 overflow-hidden rounded-xl ${layer(i)} ${
                i === index && animating ? "exo-wipe-rev" : ""
              }`}
              aria-hidden
            >
              <Image
                src={item.posterUrl || item.backdropUrl || ""}
                alt=""
                fill
                className={`object-cover ${
                  i === index && animating ? "exo-drop" : i === prev ? "exo-push" : ""
                }`}
                sizes="300px"
              />
            </div>
          ))}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[6] rounded-xl"
            style={{
              padding: "4px",
              background: "rgba(255,255,255,0.42)",
              filter: "blur(2px)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            }}
          />
        </div>

        <div className="relative z-[5] mx-auto flex h-full w-full flex-col justify-end px-5 pb-6 pt-8 sm:px-8 sm:pb-8 md:px-10 md:pb-10 lg:px-[7vw] lg:pb-[min(22vh,168px)] lg:pt-[clamp(7rem,22vh,11rem)]">
          <div className="mt-auto grid max-w-[560px] overflow-hidden pb-1 lg:w-[min(38vw,560px)] lg:pb-3 3xl:max-w-[720px]">
            {textStack.map((i) => {
              const item = slides[i];
              const active = i === index;
              const meta = [
                item.certification,
                item.duration,
                item.releaseDate?.slice(0, 4),
                item.languages[0] ? titleCase(item.languages[0]) : null,
              ]
                .filter(Boolean)
                .join(" · ");
              const cast = heroCast(item);
              const shownCast = cast.slice(0, 3);
              const extraCast = cast.length - shownCast.length;
              return (
                <div
                  key={item.id}
                  aria-hidden={!active}
                  className={`[grid-area:1/1] ${
                    active ? (animating ? "exo-rise-in" : "") : "exo-rise-out pointer-events-none"
                  }`}
                >
                  {item.genres.length ? (
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase sm:text-[11px] lg:text-[12px]">
                      {item.genres.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                  <h1 className="mt-2 text-[28px] leading-[0.98] font-semibold tracking-[-0.03em] break-words text-white sm:mt-2.5 sm:text-[36px] lg:mt-3 lg:text-[clamp(2.4rem,4vw,4.2rem)]">
                    {item.title}
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-[11px] tracking-[0.04em] text-white/85 sm:mt-2.5 sm:text-[12px] lg:mt-4 lg:text-[13px]">
                    <span className="font-bold text-accent">{item.formatBadge || "New Release"}</span>
                    {meta ? <span aria-hidden>·</span> : null}
                    {meta}
                  </p>
                  <p className="mt-2 line-clamp-2 max-w-[40ch] text-[12px] leading-5 font-light text-white/90 sm:mt-2.5 sm:text-[13px] lg:mt-4 lg:line-clamp-3 lg:text-[15px] lg:leading-6">
                    {item.description || "Discover this title in theatres near you on VYBE."}
                  </p>

                  {shownCast.length ? (
                    <div className="mt-3 lg:mt-5">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase sm:text-[11px]">
                        Cast
                      </p>
                      <ul className="mt-2 flex items-center gap-2.5 sm:gap-3">
                        {shownCast.map((person, n) => (
                          <li
                            key={`${person.id}-${person.role ?? n}`}
                            className="flex min-w-0 flex-1 items-center gap-2"
                          >
                            <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15 text-[11px] font-bold text-white ring-1 ring-white/40 lg:size-9">
                              {person.imageUrl ? (
                                <Image
                                  src={person.imageUrl}
                                  alt=""
                                  fill
                                  className="object-cover object-top"
                                  sizes="36px"
                                />
                              ) : (
                                person.name.slice(0, 1)
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[11px] leading-tight font-semibold text-white lg:text-[12px]">
                                {person.name}
                              </span>
                              {person.role ? (
                                <span className="block truncate text-[10px] leading-tight text-white/65">
                                  {person.role}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ))}
                        {extraCast > 0 ? (
                          <li className="shrink-0">
                            <Link
                              href={`/movies/${item.id}`}
                              tabIndex={active ? undefined : -1}
                              aria-label={`${extraCast} more cast for ${item.title}`}
                              className="grid size-8 place-items-center rounded-full bg-white/15 text-[11px] font-bold text-white ring-1 ring-white/40 transition-colors hover:bg-white/25 lg:size-9"
                            >
                              +{extraCast}
                            </Link>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center gap-2.5 sm:mt-5 lg:mt-7 lg:gap-3">
                    <BookTicketsButton
                      href={`/movies/${item.id}/book`}
                      certification={item.certification}
                      className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-[14px] font-extrabold text-white shadow-[0_12px_36px_rgba(255,0,91,0.35)] transition-transform hover:scale-[1.02] sm:min-w-[200px] sm:flex-none sm:px-7 lg:min-w-[220px] lg:px-8 lg:py-3.5 lg:text-[15px]"
                    >
                      <span
                        aria-hidden
                        className="inline-block size-4 shrink-0 bg-current lg:size-5"
                        style={{
                          maskImage: "url(/icons/book-ticket.png)",
                          WebkitMaskImage: "url(/icons/book-ticket.png)",
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                      />
                      Book Tickets
                    </BookTicketsButton>
                    <Link
                      href={`/movies/${item.id}`}
                      tabIndex={active ? undefined : -1}
                      className="inline-flex size-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 lg:size-12"
                      aria-label={`Details for ${item.title}`}
                    >
                      <ArrowUpRight className="size-5 lg:size-6" strokeWidth={2.4} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous movie"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 z-[7] grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-black/60 sm:left-5"
            >
              <ChevronLeft className="size-6" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              aria-label="Next movie"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 z-[7] grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-black/60 sm:right-5"
            >
              <ChevronRight className="size-6" strokeWidth={2.25} />
            </button>
          </>
        ) : null}

        {activeTrailer ? (
          <button
            type="button"
            aria-label={soundOn ? "Mute trailer" : "Play trailer with sound"}
            aria-pressed={soundOn}
            onClick={toggleSound}
            className="absolute right-5 bottom-6 z-[7] grid size-11 place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-black/60"
          >
            {soundOn ? (
              <Volume2 className="size-5" strokeWidth={2.25} />
            ) : (
              <VolumeX className="size-5" strokeWidth={2.25} />
            )}
          </button>
        ) : null}

        {count > 1 ? (
          <div
            className="absolute right-20 bottom-8 z-[6] hidden items-baseline gap-[0.18em] text-[14px] tracking-[0.05em] text-white tabular-nums md:flex"
            aria-hidden
          >
            <div className="relative grid h-4 w-[2ch] overflow-hidden leading-4">
              {textStack.map((i) => (
                <p
                  key={slides[i].id}
                  className={`[grid-area:1/1] ${
                    i === index ? (animating ? "exo-rise-in" : "") : "exo-rise-out"
                  }`}
                >
                  {pad(i + 1)}
                </p>
              ))}
            </div>
            <p className="opacity-50">/</p>
            <p className="opacity-50">{pad(count)}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
