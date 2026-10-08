"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Navigation,
  Share2,
  Star,
  Ticket,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import {
  DetailActionChip,
  DetailHighlightCard,
  DetailOfferCard,
  DetailPhotoGrid,
  DetailSection,
  buildGallery,
} from "@/components/detail/DetailParts";
import { useSectionSpy } from "@/components/detail/useSectionSpy";
import { PlayVenueCard } from "@/components/play/PlayVenueCard";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { getBookingDates } from "@/lib/data/booking";
import { formatInr } from "@/lib/format";
import { useClientNow } from "@/lib/hooks/useClientNow";
import { bookingModeFor, courtsFor, peakPrice } from "@/lib/play/slots";
import type { PlayItem } from "@/types/play";

const VENUE_TABS = [
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
] as const;

const EVENT_TABS = [
  { id: "pricing", label: "Tickets" },
  { id: "about", label: "About" },
  { id: "amenities", label: "What's included" },
  { id: "location", label: "Venue" },
] as const;

const SPORT_IMAGES: [RegExp, string][] = [
  [/football|turf|soccer/, "/images/play/sport-football.jpg"],
  [/cricket/, "/images/play/sport-cricket.jpg"],
  [/badminton/, "/images/play/sport-badminton.jpg"],
  [/pickleball/, "/images/play/sport-pickleball.jpg"],
  [/tennis/, "/images/play/sport-tennis.jpg"],
  [/volleyball/, "/images/play/sport-volleyball.jpg"],
];

function galleryFor(item: PlayItem, related: PlayItem[]) {
  const sport = (item.sport ?? "").toLowerCase();
  const sameSport = related.filter((venue) => (venue.sport ?? "").toLowerCase() === sport);
  const sportImage = SPORT_IMAGES.find(([pattern]) => pattern.test(sport))?.[1];
  return buildGallery(item.imageUrl, [
    ...(sportImage ? [sportImage] : []),
    ...sameSport.map((venue) => venue.imageUrl),
    ...related.map((venue) => venue.imageUrl),
  ]);
}

type PlayDetailViewProps = {
  item: PlayItem;
  related: PlayItem[];
};

export function PlayDetailView({ item, related }: PlayDetailViewProps) {
  const isEvent = item.kind === "event";
  const tabs: readonly { id: string; label: string }[] = isEvent
    ? EVENT_TABS
    : VENUE_TABS;
  const tabIds = useMemo(() => tabs.map((entry) => entry.id), [tabs]);
  const { active: tab, scrollTo } = useSectionSpy("play", tabIds);
  const [compact, setCompact] = useState(false);
  const now = useClientNow();
  const dates = useMemo(() => (now ? getBookingDates(7) : []), [now]);
  const [pickedDate, setDateIso] = useState("");
  const dateIso = pickedDate || (dates[0]?.iso ?? "");

  const place = [...new Set([item.venue, item.locality || "Hyderabad"].filter(Boolean))].join(", ");
  const address = `${place}, Hyderabad, Telangana`;
  const gallery = galleryFor(item, related);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const price = item.price ?? 699;
  const peak = peakPrice(item);
  const mode = bookingModeFor(item);
  const { unit, courts } = courtsFor(item);
  const rating = item.rating ?? 4.4;
  const bookHref = `/play/${item.id}/book${dateIso ? `?date=${dateIso}` : ""}`;

  useEffect(() => {
    const sentinel = document.getElementById("play-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setCompact(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function share() {
    const url = window.location.href;
    if (navigator.share) {
      void navigator.share({ title: item.title, url }).catch(() => undefined);
    } else {
      void navigator.clipboard?.writeText(url);
    }
  }

  const courtSummary =
    courts.length > 1
      ? `${courts.length} ${unit.toLowerCase()}s · ${courts.map((court) => court.detail.split(" · ")[0]).join(", ")}`
      : courts[0]?.detail ?? unit;

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

      <Container className="pt-5 md:pt-7">
        <DetailPhotoGrid title={item.title} images={gallery} />
      </Container>

      {compact ? (
        <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
          <Container className="py-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-extrabold text-text">{item.title}</p>
                <p className="truncate text-[12px] text-text-secondary">
                  {isEvent
                    ? `${formatInr(price)} ${item.priceUnit ?? "onwards"} · ${place}`
                    : `From ${formatInr(price)}/hr · ${place}`}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="hide-scrollbar flex min-w-0 gap-5 overflow-x-auto">
                {tabs.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => scrollTo(entry.id)}
                    className={`shrink-0 border-b-2 pb-1 text-[13px] font-bold transition-colors ${
                      tab === entry.id
                        ? "border-accent text-text"
                        : "border-transparent text-text-secondary hover:text-text"
                    }`}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
              <div className="hidden shrink-0 gap-2 md:flex">
                <DetailActionChip
                  href={directionsHref}
                  icon={<Navigation className="size-3.5" />}
                  label="Directions"
                />
                <Link
                  href={bookHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white"
                >
                  <Ticket className="size-3.5" />
                  {isEvent ? "Book tickets" : "Book a slot"}
                </Link>
              </div>
            </div>
          </Container>
        </div>
      ) : null}

      <Container className="grid gap-8 pt-6 pb-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
        <div>
          <div>
            <span id="play-hero-sentinel" className="block h-px w-full" />
            {item.sport ? (
              <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[11px] font-extrabold tracking-wide text-accent uppercase">
                {item.sport}
              </span>
            ) : null}
            <h1 className="mt-3 text-[30px] font-extrabold tracking-tight text-text md:text-[36px]">
              {item.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-text-secondary">
              <span className="inline-flex items-center gap-1 font-bold text-text">
                <Star className="size-4 fill-accent text-accent" />
                {rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1">
                <IndianRupee className="size-4 text-accent" />
                {isEvent
                  ? `${formatInr(price)} ${item.priceUnit ?? "onwards"}`
                  : `${formatInr(price)} ${item.priceUnit ?? "/ hour"}`}
              </span>
              {isEvent ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-4 text-accent" />
                  {item.schedule}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="size-4 text-accent" />
                  {item.hours}
                </span>
              )}
            </div>
            <p className="mt-2 inline-flex items-start gap-1.5 text-[14px] text-text-secondary">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {address}
              {item.distanceKm != null ? ` · ${item.distanceKm} km` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DetailActionChip
                href={directionsHref}
                icon={<Navigation className="size-3.5" />}
                label="Directions"
              />
              <DetailActionChip
                onClick={share}
                icon={<Share2 className="size-3.5" />}
                label="Share"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <DetailHighlightCard
              title={isEvent ? "About the event" : "About the venue"}
              text={item.description}
            />
            <DetailHighlightCard
              title={isEvent ? "When" : `${unit}s available`}
              text={isEvent ? item.schedule : courtSummary}
            />
            <DetailHighlightCard
              title="Why people go"
              text={`${rating.toFixed(1)}★ · ${(item.amenities ?? []).slice(0, 2).join(" · ")}`}
            />
          </div>

          <DetailSection
            prefix="play"
            id="pricing"
            title={isEvent ? "Tickets" : "Pricing"}
          >
            {isEvent ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailOfferCard
                  title={`${formatInr(price)} ${item.priceUnit ?? ""}`.trim()}
                  detail={`Entry for ${item.dateLabel ?? item.schedule}`}
                />
                <DetailOfferCard
                  title="Flat 10% OFF"
                  detail="On your first Play booking on VYBE"
                />
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PriceCard
                    label="Off-peak"
                    price={price}
                    unit={mode === "session" ? "/ person" : "/ hour"}
                    detail="Weekdays before 5 PM and after 11 PM"
                  />
                  <PriceCard
                    label="Peak"
                    price={peak}
                    unit={mode === "session" ? "/ person" : "/ hour"}
                    detail="Weekday evenings 5–11 PM · Weekends all day"
                    peak
                  />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <DetailOfferCard
                    title="Flat 10% OFF"
                    detail="On your first Play booking on VYBE"
                  />
                  <DetailOfferCard
                    title="Free cancellation"
                    detail="Up to 6 hours before your slot"
                  />
                </div>
              </>
            )}
          </DetailSection>

          <DetailSection
            prefix="play"
            id="about"
            title={isEvent ? "About the event" : "About the venue"}
          >
            <p className="max-w-3xl text-[15px] leading-7 text-text-secondary">
              {item.description}
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoBlock label="Sport" value={item.sport ?? "Play"} />
              <InfoBlock
                label={isEvent ? "Date & time" : "Opening hours"}
                value={isEvent ? item.schedule : (item.hours ?? "6:00 AM to 11:00 PM")}
              />
              {!isEvent ? (
                <InfoBlock
                  label={`${unit}s`}
                  value={courts.map((court) => `${court.name} (${court.detail})`).join(" · ")}
                />
              ) : null}
              {!isEvent ? (
                <InfoBlock
                  label="Booking"
                  value={
                    mode === "session"
                      ? "1-hour sessions, booked per person"
                      : "Hourly slots, 1–3 hours per booking"
                  }
                />
              ) : null}
            </div>
          </DetailSection>

          <DetailSection
            prefix="play"
            id="amenities"
            title={isEvent ? "What's included" : "Amenities"}
          >
            <ul className="grid grid-cols-2 gap-2 text-[14px] text-text-secondary sm:grid-cols-3">
              {(item.amenities ?? []).map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-xl border border-border bg-surface px-3 py-2.5 font-semibold"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </DetailSection>

          {!isEvent ? (
            <DetailSection prefix="play" id="reviews" title="Ratings & reviews">
              <div className="text-center">
                <p className="text-[40px] leading-none font-extrabold text-text">
                  {rating.toFixed(1)}
                  <Star className="ml-1 inline size-7 fill-accent text-accent" />
                </p>
                <p className="mt-2 text-[13px] text-text-secondary">
                  Based on {Math.round(rating * 61).toLocaleString("en-IN")} ratings
                </p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Score label={`${unit} quality`} value={Math.min(5, rating + 0.1)} />
                <Score label="Staff" value={Math.max(3.5, rating - 0.2)} />
                <Score label="Value" value={Math.max(3.5, rating - 0.1)} />
              </div>
            </DetailSection>
          ) : null}

          <DetailSection
            prefix="play"
            id="location"
            title={isEvent ? "Venue" : "Location"}
          >
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`${item.title} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[280px]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-text">{item.venue}</p>
            <p className="mt-1 text-[14px] text-text-secondary">{address}</p>
          </DetailSection>
        </div>

        <aside className="h-fit lg:sticky lg:top-[calc(var(--vybe-header-h)+7rem)]">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-[18px] font-extrabold text-text">
              {isEvent ? "Book tickets" : "Book a slot"}
            </h2>
            {isEvent ? (
              <>
                <p className="mt-2 text-[13px] text-text-secondary">{item.schedule}</p>
                <p className="mt-4 text-[22px] font-extrabold text-text">
                  {formatInr(price)}{" "}
                  <span className="text-[13px] font-semibold text-text-secondary">
                    {item.priceUnit ?? "onwards"}
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-[22px] font-extrabold text-text">
                    {formatInr(price)}
                    <span className="ml-1 text-[13px] font-semibold text-text-secondary">
                      {mode === "session" ? "/ person" : "/ hour"}
                    </span>
                  </p>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-accent">
                    <Zap className="size-3.5" />
                    Peak {formatInr(peak)}
                  </span>
                </div>
                <label className="mt-4 block">
                  <span className="text-[12px] font-bold text-text-secondary">Date</span>
                  <select
                    value={dateIso}
                    onChange={(event) => setDateIso(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-text outline-none"
                  >
                    {dates.map((date) => (
                      <option key={date.iso} value={date.iso}>
                        {date.isToday ? "Today" : date.weekday}, {date.day} {date.month}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-3 text-[12px] text-text-secondary">
                  Pick your {unit.toLowerCase()}, duration and start time on the next step.
                </p>
              </>
            )}
            <Link
              href={bookHref}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-sm font-bold text-bg transition-transform hover:scale-[1.01] dark:bg-white dark:text-black"
            >
              <Ticket className="size-4" />
              {isEvent ? "Book tickets" : "Check availability"}
            </Link>
          </div>
        </aside>
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

function PriceCard({
  label,
  price,
  unit,
  detail,
  peak,
}: {
  label: string;
  price: number;
  unit: string;
  detail: string;
  peak?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <p className="inline-flex items-center gap-1 text-[12px] font-extrabold tracking-[0.12em] text-text-secondary uppercase">
        {peak ? <Zap className="size-3.5 text-accent" /> : null}
        {label}
      </p>
      <p className="mt-1.5 text-[22px] font-extrabold text-text">
        {formatInr(price)}
        <span className="ml-1 text-[13px] font-semibold text-text-secondary">{unit}</span>
      </p>
      <p className="mt-1 text-[12px] text-text-secondary">{detail}</p>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-text-secondary">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-text">{value}</p>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface-muted px-3 py-3">
      <p className="text-[18px] font-extrabold text-text">{value.toFixed(1)}</p>
      <p className="mt-0.5 text-[12px] text-text-secondary">{label}</p>
    </div>
  );
}
