"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  Bath,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Clock3,
  Coffee,
  Cross,
  Droplets,
  LayoutGrid,
  Lightbulb,
  MapPin,
  PersonStanding,
  ShoppingBag,
  Trophy,
  Volume2,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import { buildGallery } from "@/components/detail/DetailParts";
import { StickyBookBar } from "@/components/movies/StickyBookBar";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { playSports } from "@/lib/data/playSports";
import type { PlayItem } from "@/types/play";

type PlayDetailViewProps = {
  item: PlayItem;
  related: PlayItem[];
};

const ABOUT_PREVIEW_CHARS = 220;

const SPORT_IMAGES: [RegExp, string][] = [
  [/football|turf|soccer/, "/images/play/sport-football.jpg"],
  [/cricket/, "/images/play/sport-cricket.jpg"],
  [/badminton/, "/images/play/sport-badminton.jpg"],
  [/pickleball/, "/images/play/sport-pickleball.jpg"],
  [/tennis/, "/images/play/sport-tennis.jpg"],
  [/volleyball/, "/images/play/sport-volleyball.jpg"],
];

const AMENITY_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /duration|hour|hrs?/i, icon: Clock3 },
  { match: /beverage|cafe|cafeteria|coffee|food/i, icon: Coffee },
  { match: /equipment|racket|paddle|bat|bring your own|rent/i, icon: Briefcase },
  { match: /washroom|toilet|changing|locker|restroom/i, icon: Bath },
  { match: /shop|store/i, icon: ShoppingBag },
  { match: /parking/i, icon: CircleParking },
  { match: /drinking|water/i, icon: Droplets },
  { match: /seating|lounge|sofa|bench/i, icon: Armchair },
  { match: /sound|speaker|music/i, icon: Volume2 },
  { match: /first.?aid|medical/i, icon: Cross },
  { match: /flood.?light|light/i, icon: Lightbulb },
  { match: /ac|air.?cond/i, icon: Wind },
  { match: /coach|trophy|referee/i, icon: Trophy },
];

function amenityIcon(label: string): LucideIcon {
  return AMENITY_ICONS.find((entry) => entry.match.test(label))?.icon ?? Lightbulb;
}

function resolveSports(item: PlayItem): string[] {
  const sports = new Set<string>();
  if (item.sport) sports.add(item.sport);
  for (const amenity of item.amenities ?? []) {
    const known = playSports.find(
      (sport) =>
        amenity.toLowerCase() === sport.label.toLowerCase() ||
        amenity.toLowerCase().includes(sport.label.toLowerCase()),
    );
    if (known) sports.add(known.label);
  }
  return [...sports];
}

function imagesFor(item: PlayItem, related: PlayItem[]) {
  const seen = new Set<string>();
  const pool: string[] = [];
  const push = (url?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    pool.push(url);
  };

  push(item.imageUrl);

  const sport = (item.sport ?? "").toLowerCase();
  const sportImage = SPORT_IMAGES.find(([pattern]) => pattern.test(sport))?.[1];
  push(sportImage);

  for (const venue of related) {
    if ((venue.sport ?? "").toLowerCase() === sport) push(venue.imageUrl);
  }
  for (const venue of related) push(venue.imageUrl);

  const hay = `${item.sport ?? ""} ${item.title}`.toLowerCase();
  for (const entry of playSports) {
    if (
      hay.includes(entry.label.toLowerCase()) ||
      hay.includes(entry.id.replace(/-/g, " "))
    ) {
      push(entry.imageUrl);
    }
  }

  if (pool.length < 5) {
    for (const entry of playSports) {
      push(entry.imageUrl);
      if (pool.length >= 8) break;
    }
  }

  return pool;
}

export function PlayDetailView({ item, related }: PlayDetailViewProps) {
  const isEvent = item.kind === "event";
  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(
    ", ",
  );
  const address = `${place}, Telangana`;
  const bookLabel = isEvent ? "Book tickets" : "Book slots";
  const bookHref = `/play/${item.id}/book`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${item.venue} ${item.locality || "Hyderabad"}`,
  )}`;

  const allImages = useMemo(() => imagesFor(item, related), [item, related]);
  const gallery = useMemo(
    () => buildGallery(item.imageUrl, allImages.slice(1)),
    [allImages, item.imageUrl],
  );

  const sports = useMemo(() => resolveSports(item), [item]);
  const thingsToKnow = useMemo(() => {
    const items: string[] = [];
    if (!isEvent) items.push("Duration 1 Hour");
    for (const amenity of item.amenities ?? []) {
      if (!items.some((entry) => entry.toLowerCase() === amenity.toLowerCase())) {
        items.push(amenity);
      }
    }
    return items;
  }, [item.amenities, isEvent]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const aboutNeedsTruncation = item.description.length > ABOUT_PREVIEW_CHARS;
  const aboutText =
    aboutExpanded || !aboutNeedsTruncation
      ? item.description
      : `${item.description.slice(0, ABOUT_PREVIEW_CHARS).trimEnd()}…`;

  useEffect(() => {
    if (!galleryOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [galleryOpen]);

  useEffect(() => {
    if (!galleryOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setGalleryOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen]);

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={item.id}
        title={item.title}
        href={`/play/${item.id}`}
        imageUrl={item.imageUrl}
        meta={place}
        category="play"
      />

      <section id="play-detail-hero" className="bg-bg">
        <Container className="pt-5 pb-2 md:pt-8 md:pb-3">
          <h1 className="text-[28px] font-extrabold tracking-tight text-text md:text-[36px] lg:text-[40px]">
            {item.title}
          </h1>
        </Container>

        <Container className="pb-6 md:pb-8">
          <PlayPhotoGallery
            title={item.title}
            images={gallery}
            onShowAll={() => setGalleryOpen(true)}
          />
        </Container>
      </section>

      <StickyBookBar
        title={item.title}
        bookHref={bookHref}
        heroId="play-detail-hero"
        bookLabel={bookLabel}
      />

      <Container className="grid gap-10 pb-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <section>
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              {sports.length} sport{sports.length === 1 ? "" : "s"} available
            </h2>
            <div className="mt-3.5 flex flex-wrap gap-2.5">
              {sports.map((sport) => (
                <span
                  key={sport}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-[14px] font-semibold text-text"
                >
                  <PersonStanding className="size-4 text-text-secondary" strokeWidth={1.75} />
                  {sport}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              About
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-text-body">
              {aboutText}
              {aboutNeedsTruncation ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => setAboutExpanded((open) => !open)}
                    className="inline-flex items-center gap-0.5 font-bold text-text"
                  >
                    {aboutExpanded ? "Read less" : "Read more"}
                    <ChevronDown
                      className={`size-4 transition-transform ${aboutExpanded ? "rotate-180" : ""}`}
                      strokeWidth={2.25}
                    />
                  </button>
                </>
              ) : null}
            </p>
          </section>

          {thingsToKnow.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
                Things to know
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                {thingsToKnow.map((entry) => {
                  const Icon = amenityIcon(entry);
                  return (
                    <li
                      key={entry}
                      className="flex items-center gap-3 text-[14px] text-text-body md:text-[15px]"
                    >
                      <Icon
                        className="size-[18px] shrink-0 text-text"
                        strokeWidth={1.6}
                      />
                      <span>{entry}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="mt-10">
            <h2 className="text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              Gallery
            </h2>
            <PlayBlurredGallery
              title={item.title}
              images={allImages}
              onShowAll={() => setGalleryOpen(true)}
            />
          </section>
        </div>

        <aside className="hidden h-fit space-y-4 lg:sticky lg:top-[calc(var(--vybe-header-h)+1.25rem)] lg:block">
          <div className="rounded-2xl bg-surface p-3 shadow-[0_8px_28px_rgba(17,24,39,0.08)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
            <Link
              href={bookHref}
              className="flex w-full items-center justify-center rounded-full bg-cta px-5 py-3.5 text-[15px] font-bold text-cta-text transition-opacity hover:opacity-90"
            >
              {bookLabel}
            </Link>
          </div>

          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[0_8px_28px_rgba(17,24,39,0.06)] transition-colors hover:border-border-strong dark:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
          >
            <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border">
              <MapPin className="size-5 text-text" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold leading-snug text-text">
                {item.venue}
                {item.locality ? `, ${item.locality}` : ""}
              </span>
              <span className="mt-1 block text-[12px] leading-5 text-text-secondary">
                {address}
              </span>
              {item.distanceKm != null ? (
                <span className="mt-1 block text-[12px] text-text-secondary">
                  {item.distanceKm} km away
                </span>
              ) : null}
            </span>
            <ChevronRight className="mt-1 size-4 shrink-0 text-text-muted" />
          </a>
        </aside>
      </Container>

      <Container className="mt-2 space-y-3 lg:hidden">
        <Link
          href={bookHref}
          className="flex w-full items-center justify-center rounded-full bg-cta px-5 py-3.5 text-[15px] font-bold text-cta-text shadow-[0_8px_24px_rgba(17,24,39,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {bookLabel}
        </Link>
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border">
            <MapPin className="size-5 text-text" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-bold leading-snug text-text">
              {item.venue}
              {item.locality ? `, ${item.locality}` : ""}
            </span>
            <span className="mt-1 block text-[12px] leading-5 text-text-secondary">
              {address}
            </span>
            {item.distanceKm != null ? (
              <span className="mt-1 block text-[12px] text-text-secondary">
                {item.distanceKm} km away
              </span>
            ) : null}
          </span>
          <ChevronRight className="mt-1 size-4 shrink-0 text-text-muted" />
        </a>
      </Container>

      {related.length > 0 ? (
        <section className="mt-10 border-t border-border bg-bg py-8 md:py-10">
          <Container>
            <h2 className="mb-5 text-[22px] font-extrabold tracking-tight text-text md:text-[26px]">
              More venues near you
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5">
              {related.map((venue) => (
                <PlayVenueCard key={venue.id} item={venue} variant="browse" />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {galleryOpen ? (
        <PlayAllPhotosModal
          title={item.title}
          images={allImages}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </div>
  );
}

/** Sharp photo centered with blurred same-image bleed on the edges */
function BlurredEdgeImage({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-muted">
      <Image
        src={src}
        alt=""
        fill
        aria-hidden
        className="scale-150 object-cover blur-2xl saturate-150"
        sizes={sizes}
        priority={priority}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

function PlayBlurredGallery({
  title,
  images,
  onShowAll,
}: {
  title: string;
  images: string[];
  onShowAll: () => void;
}) {
  const tiles = [
    images[0],
    images[1] ?? images[0],
    images[2] ?? images[0],
    images[3] ?? images[0],
  ].filter(Boolean) as string[];

  return (
    <div className="mt-4 grid h-[200px] grid-cols-[1.35fr_0.85fr] gap-2 min-[480px]:h-[240px] sm:h-[280px] sm:grid-cols-[1.45fr_repeat(3,minmax(0,0.7fr))] md:h-[320px] md:gap-2.5">
      {tiles.map((src, index) => {
        const isLast = index === tiles.length - 1;
        const hideOnMobile = index === 1 || index === 2;
        return (
          <button
            key={`${src}-blur-${index}`}
            type="button"
            onClick={onShowAll}
            className={`relative overflow-hidden rounded-2xl bg-surface-muted ${
              hideOnMobile ? "hidden sm:block" : ""
            }`}
            aria-label={isLast ? "See all photos" : `View photo ${index + 1}`}
          >
            <BlurredEdgeImage
              src={src}
              alt={index === 0 ? title : ""}
              sizes={index === 0 ? "(max-width: 640px) 60vw, 40vw" : "18vw"}
              priority={index === 0}
            />
            {isLast ? (
              <span className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-lg bg-surface px-2.5 py-1.5 text-[11px] font-bold text-text shadow-[0_4px_14px_rgba(17,24,39,0.18)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.45)] sm:bottom-3.5 sm:px-3 sm:text-[12px]">
                See all photos
                <ChevronRight className="size-3.5" strokeWidth={2.5} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function PlayPhotoGallery({
  title,
  images,
  onShowAll,
}: {
  title: string;
  images: string[];
  onShowAll: () => void;
}) {
  const hero = images[0];
  const tiles = images.slice(1, 5);

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-[20px]">
      <div className="grid h-[260px] grid-cols-1 gap-1.5 sm:h-[320px] md:h-[420px] md:grid-cols-2 md:gap-2">
        <button
          type="button"
          onClick={onShowAll}
          className="relative overflow-hidden bg-surface-muted"
          aria-label="View all photos"
        >
          <Image
            src={hero}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </button>

        <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
          {Array.from({ length: 4 }).map((_, index) => {
            const src = tiles[index] ?? hero;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={onShowAll}
                className="relative overflow-hidden bg-surface-muted"
                aria-label={`View photo ${index + 2}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="25vw"
                />
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onShowAll}
        className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[12px] font-bold text-text shadow-[0_4px_16px_rgba(17,24,39,0.16)] transition-transform hover:scale-[1.02] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)] md:right-4 md:bottom-4 md:px-4 md:py-2.5 md:text-[13px]"
      >
        <LayoutGrid className="size-3.5 md:size-4" strokeWidth={2} />
        Show all photos
      </button>
    </div>
  );
}

function PlayAllPhotosModal({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>();
    return images.filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const count = uniqueImages.length;
  const activeSrc = uniqueImages[activeIndex] ?? uniqueImages[0];

  function goPrev() {
    if (count < 2) return;
    setActiveIndex((index) => (index - 1 + count) % count);
  }

  function goNext() {
    if (count < 2) return;
    setActiveIndex((index) => (index + 1) % count);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          count < 2 ? index : (index - 1 + count) % count,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (count < 2 ? index : (index + 1) % count));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);

  useEffect(() => {
    const thumb = document.getElementById(`play-gallery-thumb-${activeIndex}`);
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  if (!activeSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
    >
      <div className="flex shrink-0 items-center justify-end px-4 pt-4 md:px-6 md:pt-5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/90 transition-opacity hover:opacity-80 md:text-[15px]"
        >
          <X className="size-4 md:size-5" strokeWidth={2.25} />
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 md:px-20 lg:px-24">
        {count > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white transition-colors hover:bg-black/50 md:left-5 md:size-12"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-5 md:size-6" strokeWidth={1.75} />
          </button>
        ) : null}

        <div className="relative h-[min(62vh,680px)] w-full max-w-5xl overflow-hidden rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:rounded-2xl">
          <Image
            key={activeSrc}
            src={activeSrc}
            alt={`${title} photo ${activeIndex + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 960px"
          />
        </div>

        {count > 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/30 text-white transition-colors hover:bg-black/50 md:right-5 md:size-12"
            aria-label="Next photo"
          >
            <ChevronRight className="size-5 md:size-6" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 px-4 pt-4 pb-5 md:px-6 md:pb-7">
        <div className="hide-scrollbar mx-auto flex w-fit max-w-full gap-2 overflow-x-auto px-1 md:gap-2.5">
          {uniqueImages.map((src, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${src}-thumb-${index}`}
                id={`play-gallery-thumb-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-14 w-[72px] shrink-0 overflow-hidden rounded-lg md:h-16 md:w-20 md:rounded-xl ${
                  active
                    ? "outline outline-2 outline-offset-2 outline-white"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${index + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
