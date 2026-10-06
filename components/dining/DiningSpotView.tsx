"use client";

import Image from "next/image";
import {
  Clock3,
  IndianRupee,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BookingConfirmed } from "@/components/bookings/BookingConfirmed";
import { Container } from "@/components/common/Container";
import { RecordRecentView } from "@/components/recent/RecordRecentView";
import {
  createBookingCode,
  createBookingId,
  saveBooking,
  type VybeBooking,
} from "@/lib/bookings/storage";
import { formatInr } from "@/lib/format";
import type { DiningSpot } from "@/types/dining";

type DiningSpotViewProps = {
  spot: DiningSpot;
};

const TABS = [
  { id: "offers", label: "All offers" },
  { id: "menu", label: "Menu" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
  { id: "location", label: "Location" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DiningSpotView({ spot }: DiningSpotViewProps) {
  const [tab, setTab] = useState<TabId>("offers");
  const [compact, setCompact] = useState(false);
  const [dateIso, setDateIso] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [guests, setGuests] = useState(2);
  const [booking, setBooking] = useState<VybeBooking | null>(null);

  const gallery = spot.gallery ?? [spot.imageUrl];
  const hero = gallery[0];
  const tiles = gallery.slice(1, 5);
  const address = spot.address ?? `${spot.locality}, Hyderabad`;
  const cost = spot.costForTwo ?? 2000;
  const hours = spot.hours ?? "12:00 PM to 11:00 PM";
  const mapSrc = `https://www.google.com/maps?q=${spot.lat ?? 17.385},${spot.lng ?? 78.4867}&z=16&output=embed`;

  const dateOptions = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return {
        iso: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        }),
      };
    });
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById("dining-hero-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: TabId) {
    setTab(id);
    document.getElementById(`dining-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (booking) {
    return <BookingConfirmed booking={booking} />;
  }

  function bookTable() {
    const date = dateOptions.find((item) => item.iso === dateIso);
    const next: VybeBooking = {
      id: createBookingId(),
      bookingCode: createBookingCode(),
      category: "dining",
      title: spot.name,
      posterUrl: spot.imageUrl,
      meta: `Table for ${guests}`,
      dateLabel: date?.label ?? dateIso,
      timeLabel: hours.split(" to ")[0] ?? "Dinner",
      venue: address,
      seats: [`T-${String(guests).padStart(2, "0")}`],
      seatClass: `Table for ${guests}`,
      theatreName: spot.name,
      ticketPrice: 0,
      convenienceFee: 0,
      paymentMethod: "Pay at venue",
      total: 0,
      createdAt: new Date().toISOString(),
    };
    saveBooking(next);
    setBooking(next);
  }

  return (
    <div className="w-full bg-bg pb-16">
      <RecordRecentView
        id={spot.id}
        title={spot.name}
        href={`/dining/${spot.id}`}
        imageUrl={spot.imageUrl}
        meta={`${spot.cuisine} · ${spot.locality}`}
        category="dining"
      />

      <Container className="pt-5 md:pt-7">
        <div className="grid h-[280px] grid-cols-1 gap-2 sm:h-[340px] md:h-[420px] md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src={hero}
              alt={spot.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
            {Array.from({ length: 4 }).map((_, index) => {
              const src = tiles[index] ?? hero;
              return (
                <div
                  key={`${src}-${index}`}
                  className="relative overflow-hidden rounded-2xl bg-surface-muted"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  {index === 3 ? (
                    <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-text">
                      Show all photos
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {compact ? (
        <div className="sticky top-(--vybe-header-h) z-40 border-b border-border bg-surface/95 backdrop-blur-xl">
          <Container className="py-3">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={spot.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-extrabold text-text">
                  {spot.name}
                </p>
                <p className="truncate text-[12px] text-text-secondary">
                  {formatInr(cost)} for two · {address}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="hide-scrollbar flex min-w-0 gap-5 overflow-x-auto">
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
              <div className="hidden shrink-0 gap-2 md:flex">
                <ActionChip
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                  icon={<Navigation className="size-3.5" />}
                  label="Directions"
                />
                <ActionChip
                  href={`tel:${spot.phone?.replace(/\s/g, "")}`}
                  icon={<Phone className="size-3.5" />}
                  label="Call"
                />
              </div>
            </div>
          </Container>
        </div>
      ) : null}

      <Container className="grid gap-8 pt-6 pb-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
        <div>
          <div id="dining-hero-meta">
            <span id="dining-hero-sentinel" className="block h-px w-full" />
            <h1 className="text-[30px] font-extrabold tracking-tight text-text md:text-[36px]">
              {spot.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-text-secondary">
              <span className="inline-flex items-center gap-1 font-bold text-text">
                <Star className="size-4 fill-accent text-accent" />
                {spot.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1">
                <IndianRupee className="size-4 text-accent" />
                {formatInr(cost)} for two
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-4 text-accent" />
                {hours}
              </span>
            </div>
            <p className="mt-2 inline-flex items-start gap-1.5 text-[14px] text-text-secondary">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {address}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionChip
                href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
                icon={<Navigation className="size-3.5" />}
                label="Directions"
              />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-text"
              >
                <Share2 className="size-3.5" />
                Share
              </button>
              <ActionChip
                href={`tel:${spot.phone?.replace(/\s/g, "")}`}
                icon={<Phone className="size-3.5" />}
                label="Call"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HighlightCard
              title="About the place"
              text={`${spot.name} brings ${spot.cuisine.toLowerCase()} to ${spot.locality} — book a table on VYBE.`}
            />
            <HighlightCard
              title="Must-try dishes"
              text="House specials, chef plates, and seasonal picks worth sharing."
            />
            <HighlightCard
              title="Why people go"
              text={`${spot.rating.toFixed(1)}★ from ${spot.reviewLabel ?? "guests"} · ${spot.tags.slice(0, 2).join(" · ")}`}
            />
          </div>

          <Section id="offers" title="Offers">
            <div className="grid gap-3 sm:grid-cols-2">
              <OfferCard
                title={spot.offer ?? "Flat 20% OFF"}
                detail="Valid today · limited slots"
              />
              <OfferCard
                title="Flat 10% OFF"
                detail="No booking required · all day"
              />
            </div>
          </Section>

          <Section id="menu" title="Menu">
            <p className="text-[13px] text-text-secondary">Food menu</p>
            <div className="relative mt-3 aspect-[3/4] w-[180px] overflow-hidden rounded-xl bg-surface-muted sm:w-[220px]">
              <Image
                src={spot.menuImageUrl ?? spot.imageUrl}
                alt={`${spot.name} menu`}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </Section>

          <Section id="reviews" title="Ratings & reviews">
            <ReviewsPanel spot={spot} />
          </Section>

          <Section id="about" title="About the restaurant">
            <div className="space-y-5">
              <div>
                <p className="text-[13px] font-bold text-text-secondary">Cost</p>
                <p className="mt-1 text-[15px] font-semibold text-text">
                  {formatInr(cost)} for two
                </p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-text-secondary">
                  Cuisines
                </p>
                <p className="mt-1 text-[15px] font-semibold text-text">
                  {spot.cuisine}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-text-secondary">
                  Available facilities
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-[13px] text-text-secondary sm:grid-cols-3">
                  {(spot.facilities ?? []).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section id="location" title="Location">
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`${spot.name} map`}
                src={mapSrc}
                className="h-[240px] w-full border-0 md:h-[280px]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-[16px] font-extrabold text-text">
              {spot.name}
            </p>
            <p className="mt-1 text-[14px] text-text-secondary">{address}</p>
            <p className="mt-2 text-[14px] font-semibold text-text">
              {spot.phone}
            </p>
          </Section>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-[18px] font-extrabold text-text">Book a table</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[12px] font-bold text-text-secondary">
                  Date
                </span>
                <select
                  value={dateIso}
                  onChange={(event) => setDateIso(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-text outline-none"
                >
                  {dateOptions.map((item) => (
                    <option key={item.iso} value={item.iso}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] font-bold text-text-secondary">
                  Guests
                </span>
                <select
                  value={guests}
                  onChange={(event) =>
                    setGuests(Number.parseInt(event.target.value, 10))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[13px] font-semibold text-text outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                    <option key={count} value={count}>
                      {count} guest{count > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={bookTable}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-sm font-bold text-bg transition-transform hover:scale-[1.01] dark:bg-white dark:text-black"
            >
              <Users className="size-4" />
              Book a table
            </button>
          </div>
        </aside>
      </Container>
    </div>
  );
}

function ActionChip({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-text"
    >
      {icon}
      {label}
    </a>
  );
}

function HighlightCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <p className="text-[14px] font-extrabold text-text">{title}</p>
      <p className="mt-1.5 text-[13px] leading-5 text-text-secondary">{text}</p>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={`dining-${id}`} className="scroll-mt-[calc(var(--vybe-header-h)+5rem)] pt-10">
      <h2 className="mb-4 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function OfferCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-[#f3f0ff] px-4 py-5 dark:bg-white/5">
      <p className="text-[18px] font-extrabold tracking-tight text-text">
        {title}
      </p>
      <p className="mt-1 text-[13px] text-text-secondary">{detail}</p>
    </div>
  );
}

function ReviewsPanel({ spot }: { spot: DiningSpot }) {
  const scores = spot.scores ?? { ambience: 4.2, food: 4.3, service: 4.1 };
  const count = spot.reviewCount ?? 240;

  return (
    <div>
      <div className="text-center">
        <p className="text-[40px] font-extrabold leading-none text-text">
          {spot.rating.toFixed(1)}
          <Star className="ml-1 inline size-7 fill-accent text-accent" />
        </p>
        <p className="mt-2 text-[13px] text-text-secondary">
          Based on {count.toLocaleString("en-IN")} ratings
        </p>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Score label="Ambience" value={scores.ambience} />
        <Score label="Food" value={scores.food} />
        <Score label="Service" value={scores.service} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {spot.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-text"
          >
            {tag}
          </span>
        ))}
      </div>
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
