"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Navigation,
  Share2,
  Ticket,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EventCarousel } from "@/components/events/EventCard";
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
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { formatInr } from "@/lib/format";
import type { LiveEvent } from "@/types/event";

const TABS = [
  { id: "offers", label: "Offers" },
  { id: "about", label: "About" },
  { id: "venue", label: "Venue" },
  { id: "guidelines", label: "Guidelines" },
  { id: "location", label: "Location" },
] as const;

const TAB_IDS = TABS.map((item) => item.id);

type EventDetailViewProps = {
  event: LiveEvent;
  related: LiveEvent[];
};

export function EventDetailView({ event, related }: EventDetailViewProps) {
  const { active: tab, scrollTo: scrollToSection } = useSectionSpy(
    "event",
    TAB_IDS,
  );
  const [compact, setCompact] = useState(false);

  const dateLabel = [event.day, event.month].filter(Boolean).join(" ");
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const gallery = buildGallery(
    event.imageUrl,
    related.map((item) => item.imageUrl),
  );
  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(place || "Hyderabad") +
    "&z=15&output=embed";

  useEffect(() => {
    const sentinel = document.getElementById("event-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setCompact(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const highlights = useMemo(
    () => [
      {
        title: "About the event",
        text:
          event.description ||
          `${event.title} at ${place || "Hyderabad"} — book on VYBE.`,
      },
      {
        title: "Best for",
        text: `${event.category} fans · Groups & date nights · Live experiences`,
      },
      {
        title: "Why book on VYBE",
        text: "Fair prices, instant confirmation, and digital tickets on your phone.",
      },
    ],
    [event, place],
  );

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={event.id}
        title={event.title}
        href={`/events/${event.id}`}
        imageUrl={event.imageUrl}
        meta={place}
        category="events"
      />

      <Container className="pt-2 md:pt-5 lg:pt-7">
        <DetailPhotoGrid title={event.title} images={gallery} />
      </Container>

      {compact ? (
        <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
          <Container className="py-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={event.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-extrabold text-text">
                  {event.title}
                </p>
                <p className="truncate text-[12px] text-text-secondary">
                  {formatInr(event.startingPrice)} onwards · {place}
                </p>
              </div>
            </div>
            <div className="mt-3 hide-scrollbar flex gap-5 overflow-x-auto">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`shrink-0 border-b-2 pb-1 text-[13px] font-bold ${
                    tab === item.id
                      ? "border-accent text-text"
                      : "border-transparent text-text-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <Container className="grid gap-8 pt-3 pb-4 md:pt-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12 lg:pt-6">
        <div>
          <div id="event-hero-meta">
            <span id="event-hero-sentinel" className="block h-px w-full" />
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[11px] font-extrabold tracking-wide text-accent uppercase">
              {event.category}
            </span>
            <h1 className="mt-3 text-[30px] font-extrabold tracking-tight text-text md:text-[36px]">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-text-secondary">
              {dateLabel ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-4 text-accent" />
                  {dateLabel} onwards
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-4 text-accent" />
                Gates open 60 min early
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-text">
                {formatInr(event.startingPrice)} onwards
              </span>
            </div>
            {place ? (
              <p className="mt-2 inline-flex items-start gap-1.5 text-[14px] text-text-secondary">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {place}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <DetailActionChip
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
                icon={<Navigation className="size-3.5" />}
                label="Directions"
              />
              <DetailActionChip
                icon={<Share2 className="size-3.5" />}
                label="Share"
                onClick={() => {
                  if (navigator.share) {
                    void navigator.share({
                      title: event.title,
                      url: window.location.href,
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <DetailHighlightCard key={item.title} {...item} />
            ))}
          </div>

          <DetailSection prefix="event" id="offers" title="Offers">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailOfferCard
                title="Early bird from ₹499"
                detail="Limited seats · book before show week"
              />
              <DetailOfferCard
                title="Group of 4+"
                detail="Save 10% on selected categories"
              />
            </div>
          </DetailSection>

          <DetailSection prefix="event" id="about" title="About the event">
            <p className="max-w-3xl text-[15px] leading-7 text-text-secondary">
              {event.description ||
                `${event.title} is happening at ${place || "a venue near you"}.`}
            </p>
          </DetailSection>

          <DetailSection prefix="event" id="venue" title="Venue">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-[15px] font-extrabold text-text">
                {event.venue || "To be announced"}
              </p>
              {event.city ? (
                <p className="mt-1 text-[13px] text-text-secondary">{event.city}</p>
              ) : null}
            </div>
          </DetailSection>

          <DetailSection prefix="event" id="guidelines" title="Terms & guidelines">
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-6 text-text-secondary">
              <li>Tickets once booked cannot be exchanged or refunded.</li>
              <li>Please carry a valid ID proof along with your e-ticket.</li>
              <li>Gates open 60 minutes before the scheduled start time.</li>
              <li>Outside food and beverages may not be allowed at the venue.</li>
            </ul>
          </DetailSection>

          <DetailSection prefix="event" id="location" title="Location">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`${event.title} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[280px]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-text">{event.venue}</p>
            <p className="mt-1 text-[14px] text-text-secondary">{place}</p>
          </DetailSection>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(17,24,39,0.06)]">
            <p className="text-[12px] font-extrabold tracking-[0.14em] text-accent uppercase">
              Book tickets
            </p>
            <h2 className="mt-2 text-[18px] font-extrabold text-text">{event.title}</h2>
            <p className="mt-2 text-[13px] text-text-secondary">{place}</p>
            <p className="mt-4 text-[22px] font-extrabold text-text">
              {formatInr(event.startingPrice)}{" "}
              <span className="text-[13px] font-semibold text-text-secondary">
                onwards
              </span>
            </p>
            <Link
              href={`/events/${event.id}/book`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-white"
            >
              <Ticket className="size-4" />
              Book tickets
            </Link>
            <p className="mt-3 text-center text-[12px] text-text-muted">
              Instant confirmation on VYBE
            </p>
          </div>
        </aside>
      </Container>

      {related.length > 0 ? (
        <section className="mt-6 border-t border-border bg-bg py-8 md:py-10">
          <Container>
            <h2 className="mb-5 text-[22px] font-extrabold tracking-tight text-text md:text-[26px]">
              You might also like
            </h2>
            <EventCarousel events={related} />
          </Container>
        </section>
      ) : null}
    </div>
  );
}
