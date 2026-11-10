"use client";

import { BadgeCheck, Navigation, Target, UsersRound } from "lucide-react";
import { EventCarousel } from "@/components/events/EventCard";
import { Container } from "@/components/common/Container";
import { DetailOfferCard } from "@/components/detail/DetailParts";
import {
  PosterCompactBar,
  PosterSection,
  posterButtonClass,
} from "@/components/detail/PosterDetailLayout";
import { EventDetailHero } from "@/components/events/EventDetailHero";
import { useHideNavOnScroll } from "@/components/detail/useHideNavOnScroll";
import { useSectionSpy } from "@/components/detail/useSectionSpy";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import { formatInr } from "@/lib/format";
import type { LiveEvent } from "@/types/event";

const TABS = [
  { id: "about", label: "About" },
  { id: "offers", label: "Offers" },
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
  const compact = useHideNavOnScroll("event-hero-sentinel");

  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place || "Hyderabad",
  )}`;
  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(place || "Hyderabad") +
    "&z=15&output=embed";

  const highlights = [
    {
      icon: Target,
      title: "Best for",
      text: `${event.category} fans · Live experiences`,
    },
    { icon: UsersRound, title: "Great with", text: "Friends, groups & date nights" },
    { icon: BadgeCheck, title: "On VYBE", text: "Instant confirmation · mobile tickets" },
  ];

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

      <PosterCompactBar
        visible={compact}
        imageSrc={event.imageUrl}
        title={event.title}
        subtitle={`${formatInr(event.startingPrice)} onwards · ${place}`}
        tabs={TABS}
        active={tab}
        onSelect={scrollToSection}
      />

      <Container className="pt-3 pb-4 md:pt-5 lg:pt-7">
        <EventDetailHero event={event} place={place} mapsHref={mapsHref}>
          <PosterSection id="event-about" title="About the event">
            <p className="text-[14px] leading-7 text-text-secondary">
              {event.description ||
                `${event.title} is happening at ${place || "a venue near you"}.`}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-surface-muted p-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-text text-bg dark:bg-white dark:text-black">
                    <Icon className="size-[18px]" strokeWidth={2} />
                  </span>
                  <p className="mt-2.5 text-[13px] font-extrabold text-text">{title}</p>
                  <p className="mt-0.5 text-[12px] leading-5 text-text-secondary">{text}</p>
                </div>
              ))}
            </div>
          </PosterSection>

          <PosterSection id="event-offers" title="Offers">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <DetailOfferCard
                title="Early bird from ₹499"
                detail="Limited seats · book before show week"
              />
              <DetailOfferCard
                title="Group of 4+"
                detail="Save 10% on selected categories"
              />
            </div>
          </PosterSection>

          <PosterSection id="event-guidelines" title="Terms & guidelines">
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-6 text-text-secondary marker:text-text-muted">
              <li>Tickets once booked cannot be exchanged or refunded.</li>
              <li>Please carry a valid ID proof along with your e-ticket.</li>
              <li>Gates open 60 minutes before the scheduled start time.</li>
              <li>Outside food and beverages may not be allowed at the venue.</li>
            </ul>
          </PosterSection>

          <PosterSection id="event-location" title="Location">
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title={`${event.title} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[300px]"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-extrabold text-text">
                  {event.venue || "Venue to be announced"}
                </p>
                <p className="mt-0.5 text-[13px] text-text-secondary">{place}</p>
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
        </EventDetailHero>
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
