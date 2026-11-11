"use client";

import Link from "next/link";
import {
  Armchair,
  ArrowUpRight,
  Bath,
  Briefcase,
  CalendarDays,
  ChevronDown,
  CircleParking,
  Clock3,
  Coffee,
  Cross,
  Droplets,
  Lightbulb,
  MapPin,
  Navigation,
  PersonStanding,
  ShoppingBag,
  Star,
  Trophy,
  Volume2,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import {
  PosterCompactBar,
  PosterDetailLayout,
  PosterIconBadge,
  PosterInfoRow,
  PosterMapChip,
  PosterSection,
  posterButtonClass,
  posterPriceChipClass,
  posterChipClass,
} from "@/components/detail/PosterDetailLayout";
import { DetailGallery } from "@/components/detail/DetailGallery";
import { useHideNavOnScroll } from "@/components/detail/useHideNavOnScroll";
import { useSectionSpy } from "@/components/detail/useSectionSpy";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { playSports } from "@/lib/data/playSports";
import { formatInr } from "@/lib/format";
import type { PlayItem } from "@/types/play";

type PlayDetailViewProps = {
  item: PlayItem;
  related: PlayItem[];
};

const TABS = [
  { id: "sports", label: "Sports" },
  { id: "about", label: "About" },
  { id: "amenities", label: "Things to know" },
  { id: "gallery", label: "Gallery" },
  { id: "location", label: "Location" },
] as const;

const TAB_IDS = TABS.map((entry) => entry.id);

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
  for (const tag of item.sports ?? []) sports.add(tag);
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

  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(`${item.venue} ${item.locality || "Hyderabad"}`) +
    "&z=15&output=embed";
  const priceValue = item.price != null ? formatInr(item.price) : "Free";
  const primarySport = playSports.find(
    (entry) => entry.label.toLowerCase() === (item.sport ?? "").toLowerCase(),
  );

  const { active: tab, scrollTo: scrollToSection } = useSectionSpy("play", TAB_IDS);
  const compact = useHideNavOnScroll("play-hero-sentinel");

  const allImages = useMemo(() => imagesFor(item, related), [item, related]);

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

  const [aboutExpanded, setAboutExpanded] = useState(false);

  const aboutNeedsTruncation = item.description.length > ABOUT_PREVIEW_CHARS;
  const aboutText =
    aboutExpanded || !aboutNeedsTruncation
      ? item.description
      : `${item.description.slice(0, ABOUT_PREVIEW_CHARS).trimEnd()}…`;

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

      <PosterCompactBar
        visible={compact}
        imageSrc={item.imageUrl}
        title={item.title}
        subtitle={`${priceValue}${item.priceUnit ? ` ${item.priceUnit}` : ""} · ${place}`}
        tabs={TABS}
        active={tab}
        onSelect={scrollToSection}
      />

      <Container className="pt-3 pb-4 md:pt-5 lg:pt-7">
        <PosterDetailLayout
          title={item.title}
          posterSrc={item.imageUrl}
          sentinelId="play-hero-sentinel"
          saveItem={{
            id: item.id,
            title: item.title,
            href: `/play/${item.id}`,
            imageUrl: item.imageUrl,
            meta: place,
            category: "play",
          }}
          bookHref={bookHref}
          bookLabel={bookLabel}
          priceCaption={isEvent ? "Entry from" : "Slots from"}
          priceValue={`${priceValue}${item.priceUnit ? ` ${item.priceUnit}` : ""}`}
          chips={
            <>
              {item.price != null ? (
                <span className={posterPriceChipClass}>
                  From {priceValue}
                  {item.priceUnit ? ` ${item.priceUnit}` : ""}
                </span>
              ) : null}
              {primarySport ? (
                <Link href={primarySport.href} className={posterChipClass}>
                  {primarySport.label}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ) : null}
            </>
          }
          trailingChips={
            item.rating != null ? (
              <span className={posterChipClass}>
                <Star className="size-3.5 fill-current" />
                {item.rating.toFixed(1)}
              </span>
            ) : null
          }
          info={
            <>
              <PosterInfoRow
                badge={
                  <PosterIconBadge>
                    {isEvent ? (
                      <CalendarDays className="size-5" />
                    ) : (
                      <Clock3 className="size-5" />
                    )}
                  </PosterIconBadge>
                }
                title={
                  isEvent
                    ? (item.dateLabel ?? item.schedule)
                    : item.hours
                      ? `Open ${item.hours}`
                      : item.schedule
                }
                subtitle={isEvent ? (item.timeLabel ?? item.schedule) : item.schedule}
              />
              <PosterInfoRow
                badge={
                  <PosterIconBadge>
                    <MapPin className="size-5" />
                  </PosterIconBadge>
                }
                title={
                  <>
                    {item.venue}
                    <PosterMapChip href={mapsHref} />
                  </>
                }
                subtitle={
                  item.distanceKm != null
                    ? `${address} · ${item.distanceKm} km away`
                    : address
                }
              />
            </>
          }
        >
          {sports.length > 0 ? (
            <PosterSection
              id="play-sports"
              title={`${sports.length} sport${sports.length === 1 ? "" : "s"} available`}
            >
              <div className="flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <span
                    key={sport}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-[13px] font-bold text-text"
                  >
                    <PersonStanding className="size-4 text-text-secondary" strokeWidth={1.75} />
                    {sport}
                  </span>
                ))}
              </div>
            </PosterSection>
          ) : null}

          <PosterSection id="play-about" title="About">
            <p className="text-[14px] leading-7 text-text-secondary">
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
          </PosterSection>

          {thingsToKnow.length > 0 ? (
            <PosterSection id="play-amenities" title="Things to know">
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {thingsToKnow.map((entry) => {
                  const Icon = amenityIcon(entry);
                  return (
                    <li
                      key={entry}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-[13px] font-semibold text-text"
                    >
                      <Icon className="size-[18px] shrink-0 text-text" strokeWidth={1.75} />
                      <span>{entry}</span>
                    </li>
                  );
                })}
              </ul>
            </PosterSection>
          ) : null}

          <PosterSection id="play-gallery" title="Gallery">
            <DetailGallery title={item.title} images={allImages} />
          </PosterSection>

          <PosterSection id="play-location" title="Location">
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title={`${item.title} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[300px]"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-extrabold text-text">{item.venue}</p>
                <p className="mt-0.5 text-[13px] text-text-secondary">{address}</p>
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className={posterButtonClass}
              >
                <Navigation className="size-3.5" />
                Directions
              </a>
            </div>
          </PosterSection>
        </PosterDetailLayout>
      </Container>

      {related.length > 0 ? (
        <section className="mt-6 border-t border-border bg-bg py-8 md:py-10">
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
    </div>
  );
}
