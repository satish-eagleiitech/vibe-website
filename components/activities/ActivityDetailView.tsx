"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  Navigation,
  Share2,
  Ticket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityBookFlow } from "@/components/activities/ActivityBookFlow";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { ActivityCarousel } from "@/components/activities/ActivityCard";
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
import {
  type VybeBooking,
} from "@/lib/bookings/storage";
import { formatInr } from "@/lib/format";
import type { Activity } from "@/types/activity";

const TABS = [
  { id: "offers", label: "Offers" },
  { id: "about", label: "About" },
  { id: "schedule", label: "Schedule" },
  { id: "guidelines", label: "Guidelines" },
  { id: "location", label: "Location" },
] as const;

const TAB_IDS = TABS.map((item) => item.id);

type ActivityDetailViewProps = {
  activity: Activity;
  related: Activity[];
};

export function ActivityDetailView({ activity, related }: ActivityDetailViewProps) {
  const { active: tab, scrollTo: scrollToSection } = useSectionSpy(
    "activity",
    TAB_IDS,
  );
  const [compact, setCompact] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState<VybeBooking | null>(null);

  const venue = activity.venue ?? activity.category;
  const place = `${venue}, Hyderabad`;
  const gallery = buildGallery(
    activity.imageUrl,
    related.map((item) => item.imageUrl),
  );
  const mapSrc =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(place) +
    "&z=15&output=embed";

  useEffect(() => {
    const sentinel = document.getElementById("activity-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setCompact(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (booking) {
    return <BookingConfirmed booking={booking} />;
  }

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={activity.id}
        title={activity.title}
        href={`/activities/${activity.id}`}
        imageUrl={activity.imageUrl}
        meta={venue}
        category="activities"
      />

      <Container className="pt-2 md:pt-5 lg:pt-7">
        <DetailPhotoGrid title={activity.title} images={gallery} />
      </Container>

      {compact ? (
        <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
          <Container className="py-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={activity.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-extrabold text-text">
                  {activity.title}
                </p>
                <p className="truncate text-[12px] text-text-secondary">
                  {formatInr(activity.price)}
                  {activity.priceUnit} · {venue}
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
          <div id="activity-hero-meta">
            <span id="activity-hero-sentinel" className="block h-px w-full" />
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[11px] font-extrabold tracking-wide text-accent uppercase">
              {activity.category}
            </span>
            <h1 className="mt-3 text-[30px] font-extrabold tracking-tight text-text md:text-[36px]">
              {activity.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-text-secondary">
              <span className="inline-flex items-center gap-1 font-bold text-text">
                <IndianRupee className="size-4 text-accent" />
                {formatInr(activity.price)}
                {activity.priceUnit}
              </span>
              {activity.schedule ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="size-4 text-accent" />
                  {activity.schedule}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4 text-accent" />
                Slots all week
              </span>
            </div>
            <p className="mt-2 inline-flex items-start gap-1.5 text-[14px] text-text-secondary">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {place}
            </p>
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
                      title: activity.title,
                      url: window.location.href,
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <DetailHighlightCard
              title="About the experience"
              text={activity.description}
            />
            <DetailHighlightCard
              title="Duration"
              text="Typical visit 2–4 hours · arrive 15 minutes early"
            />
            <DetailHighlightCard
              title="Good to know"
              text={`${activity.category} · Family friendly · Instant VYBE confirmation`}
            />
          </div>

          <DetailSection prefix="activity" id="offers" title="Offers">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailOfferCard
                title="Weekday 15% OFF"
                detail="Mon–Thu slots · auto-applied at checkout"
              />
              <DetailOfferCard
                title="Kids go free"
                detail="One child under 8 with two paid adults"
              />
            </div>
          </DetailSection>

          <DetailSection prefix="activity" id="about" title="About">
            <p className="max-w-3xl text-[15px] leading-7 text-text-secondary">
              {activity.description}
            </p>
          </DetailSection>

          <DetailSection prefix="activity" id="schedule" title="Schedule">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-[15px] font-extrabold text-text">
                {activity.schedule ?? "Multiple daily slots"}
              </p>
              <p className="mt-2 text-[13px] text-text-secondary">
                Pick a visit date, then choose your tickets.
              </p>
            </div>
          </DetailSection>

          <DetailSection prefix="activity" id="guidelines" title="Guidelines">
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-6 text-text-secondary">
              <li>Carry a valid photo ID for verification at entry.</li>
              <li>Follow venue safety instructions and staff guidance.</li>
              <li>Reschedule is subject to availability up to 24 hours before.</li>
              <li>Weather-dependent activities may move slots with prior notice.</li>
            </ul>
          </DetailSection>

          <DetailSection prefix="activity" id="location" title="Location">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`${activity.title} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[280px]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-text">{venue}</p>
            <p className="mt-1 text-[14px] text-text-secondary">{place}</p>
          </DetailSection>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-[18px] font-extrabold text-text">Book tickets</h2>
            <p className="mt-2 text-[13px] text-text-secondary">
              From {formatInr(activity.price)}
              {activity.priceUnit}
            </p>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-sm font-bold text-bg dark:bg-white dark:text-black"
            >
              <Ticket className="size-4" />
              Book tickets
            </button>
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
              More activities near you
            </h2>
            <ActivityCarousel activities={related} />
          </Container>
        </section>
      ) : null}

      {bookingOpen ? (
        <ActivityBookFlow
          activity={activity}
          onClose={() => setBookingOpen(false)}
          onConfirmed={(next) => {
            setBookingOpen(false);
            setBooking(next);
          }}
        />
      ) : null}
    </div>
  );
}
