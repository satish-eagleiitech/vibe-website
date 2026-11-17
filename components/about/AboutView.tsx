"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";
import { AboutLoveSection } from "@/components/about/AboutLoveSection";
import { useAboutMotion } from "@/components/about/useAboutMotion";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

const featured = {
  tag: "Our story",
  title: "One app for every plan in the city",
  body: "Showtimes, concerts, adventures and sports slots used to live in different chats and screenshots. VYBE brings them together — discover, book, and walk in with a QR.",
  image: "/images/about/lux-story-hero.jpg",
  read: "Built in Hyderabad",
};

const storyCards = [
  {
    tag: "Movies",
    title: "Seats, snacks and offers in one flow",
    body: "Pick a show, grab F&B, apply bank offers, and pay — without bouncing between apps.",
    image: "/images/about/lux-card-movies.jpg",
    href: "/movies",
  },
  {
    tag: "Events",
    title: "Nights worth dressing up for",
    body: "Comedy, live music, workshops and fests curated for your city.",
    image: "/images/about/lux-card-events.jpg",
    href: "/events",
  },
  {
    tag: "Play",
    title: "Book the turf, not the group chat",
    body: "Courts, nets and game zones with clear hourly slots and free cancellation windows.",
    image: "/images/about/lux-card-play.jpg",
    href: "/play",
  },
];

const pillars = [
  {
    title: "Movies",
    body: "Showtimes, seats, food and bank offers — checkout that feels finished.",
    href: "/movies",
    image: "/images/about/lux-pillar-movies.jpg",
  },
  {
    title: "Events",
    body: "Concerts, comedy, workshops and nightlife near you.",
    href: "/events",
    image: "/images/about/lux-pillar-events.jpg",
  },
  {
    title: "Activities",
    body: "Parks, fitness, adventures and weekend escapes.",
    href: "/activities",
    image: "/images/about/lux-pillar-activities.jpg",
  },
  {
    title: "Play",
    body: "Turfs, courts and game zones you can book by the hour.",
    href: "/play",
    image: "/images/about/lux-pillar-play.jpg",
  },
];

const values = [
  {
    title: "Clear prices",
    body: "Fees and refunds shown before you pay — no surprise charges at the gate.",
    tone: "bg-[#F3E7C9] text-[#2a2110]",
  },
  {
    title: "City-first discovery",
    body: "Listings follow your city so you see plans you can actually reach tonight.",
    tone: "bg-[#E4EDE6] text-[#1a2e24]",
  },
  {
    title: "Tickets that stick",
    body: "QR, booking ID and directions live under Profile → Bookings on this device.",
    tone: "bg-[#F2D9E3] text-[#4a1830]",
  },
];

const trusts = [
  { icon: Ticket, title: "Instant tickets", body: "QR ready the moment you pay" },
  { icon: ShieldCheck, title: "Secure checkout", body: "Payments via trusted partners" },
  { icon: Zap, title: "Fast discovery", body: "City-aware movies, events & play" },
  { icon: QrCode, title: "Walk-in ready", body: "Screenshots welcome at entry" },
];

export function AboutView() {
  const rootRef = useRef<HTMLDivElement>(null);
  useAboutMotion(rootRef);

  return (
    <div ref={rootRef} className="about-lux w-full overflow-x-hidden pb-16 md:pb-24">
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.14),_transparent_50%),radial-gradient(ellipse_at_80%_0%,_rgba(255,0,91,0.1),_transparent_45%)]"
        />
        <Container className="relative text-center">
          <span
            data-about-hero
            className="inline-flex rounded-full border border-[#D4AF37]/35 bg-surface/90 px-3.5 py-1 text-[11px] font-extrabold tracking-[0.18em] text-[#8a6d1f] uppercase shadow-sm backdrop-blur dark:text-[#E8D59A]"
          >
            About
          </span>
          <h1
            data-about-hero
            className="mx-auto mt-5 max-w-[18ch] text-[36px] leading-[1.05] font-extrabold tracking-tight text-text md:text-[54px]"
          >
            Luxury plans that help you move{" "}
            <em className="font-[family-name:var(--font-fraunces)] font-semibold text-accent italic">
              faster.
            </em>
          </h1>
          <p
            data-about-hero
            className="mx-auto mt-4 max-w-[540px] text-[15px] leading-relaxed text-text-secondary md:text-[16px]"
          >
            {siteConfig.name} is {siteConfig.tagline.toLowerCase()} — discover what&apos;s on,
            book in minutes, and keep every ticket in one place.
          </p>
        </Container>
      </section>

      <Container className="space-y-8 md:space-y-10">
        <article
          data-about-reveal
          className="overflow-hidden rounded-[28px] bg-surface shadow-[0_30px_80px_-36px_rgba(15,15,20,0.5)] ring-1 ring-[#D4AF37]/15 md:grid md:grid-cols-[1.08fr_1fr]"
        >
          <div className="relative min-h-[260px] overflow-hidden md:min-h-[400px]">
            <Image
              data-about-ken
              src={featured.image}
              alt=""
              fill
              className="object-cover will-change-transform"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/25" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(212,175,55,0.12)_100%)]" />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
            <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/30 bg-[#F8F1DE] px-3 py-1 text-[11px] font-extrabold tracking-wide text-[#7a5f18] uppercase dark:border-[#D4AF37]/40 dark:bg-[#2a2410] dark:text-[#E8D59A]">
              {featured.tag}
            </span>
            <h2 className="mt-4 text-[26px] leading-tight font-extrabold tracking-tight text-text md:text-[34px]">
              {featured.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              {featured.body}
            </p>
            <p className="mt-6 flex items-center gap-2 text-[13px] font-bold text-text-muted">
              <MapPin className="size-3.5 text-accent" />
              {featured.read} · {siteConfig.name}
            </p>
          </div>
        </article>

        <div data-about-stagger className="grid gap-4 md:grid-cols-3 md:gap-5">
          {storyCards.map((card) => (
            <Link
              key={card.tag}
              data-about-item
              href={card.href}
              className="group overflow-hidden rounded-[28px] bg-surface shadow-[0_24px_60px_-30px_rgba(15,15,20,0.45)] ring-1 ring-black/5 transition-transform duration-500 hover:-translate-y-1.5 dark:ring-white/10"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-text uppercase shadow-sm backdrop-blur dark:bg-black/70 dark:text-white">
                  {card.tag}
                </span>
              </div>
              <div className="px-5 pt-1 pb-5">
                <h3 className="text-[17px] leading-snug font-extrabold text-text">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {card.body}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-6 md:space-y-8">
          <div
            data-about-reveal
            className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]"
          >
            <div className="overflow-hidden rounded-[28px] bg-[#EDE8FF] text-[#1b1640] shadow-[0_20px_50px_-28px_rgba(40,20,80,0.35)] md:grid md:grid-cols-[0.95fr_1.05fr] dark:bg-[#2a2438] dark:text-[#f0ebff]">
              <div className="relative min-h-[220px] overflow-hidden md:min-h-full">
                <Image
                  src="/images/about/lux-why.jpg"
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-[11px] font-extrabold tracking-[0.16em] uppercase opacity-70">
                  Why VYBE
                </p>
                <h3 className="mt-2 text-[24px] leading-tight font-extrabold md:text-[28px]">
                  Plans shouldn&apos;t need five apps
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed opacity-80">
                  We started in Hyderabad with a simple bet: if discovery and booking
                  lived together, weekends would get easier — and tickets would stop
                  getting lost in WhatsApp.
                </p>
              </div>
            </div>
            <div
              data-about-float
              className="flex flex-col justify-center rounded-[28px] bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.3)] ring-1 ring-[#D4AF37]/20 lg:p-7"
            >
              <p className="text-[20px] leading-snug font-extrabold text-text md:text-[22px]">
                From first browse to entry QR — one calm path.
              </p>
              <Link
                href="/movies"
                className="mt-4 inline-flex w-fit rounded-full border border-border bg-bg px-4 py-2 text-[13px] font-extrabold text-text shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
              >
                Explore movies
              </Link>
            </div>
          </div>

          <div
            data-about-reveal
            className="grid items-stretch gap-4 lg:grid-cols-[minmax(200px,0.55fr)_minmax(0,1.2fr)_minmax(180px,0.55fr)]"
          >
            <div className="flex flex-col justify-center rounded-[28px] bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.3)] lg:p-7">
              <p className="text-[20px] leading-snug font-extrabold text-text md:text-[22px]">
                Host a show or list a venue — we bring the crowd.
              </p>
              <Link
                href="/partner-with-us"
                className="mt-4 inline-flex w-fit rounded-full border border-border bg-bg px-4 py-2 text-[13px] font-extrabold text-text shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
              >
                Partner with us
              </Link>
            </div>
            <div className="rounded-[28px] bg-[linear-gradient(145deg,#1a0f1f_0%,#2A1830_55%,#3d1f45_100%)] p-6 text-white shadow-[0_24px_60px_-28px_rgba(42,24,48,0.65)] md:p-8">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#E8D59A] uppercase">
                For partners
              </p>
              <h3 className="mt-2 text-[24px] leading-tight font-extrabold md:text-[28px]">
                Events & venues on the same network
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                Organisers sell tickets. Venue owners open hourly slots. Cinema and
                activity operators can reach us directly for inventory deals.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/list-your-events"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold transition-colors hover:bg-white/15"
                >
                  List events
                </Link>
                <Link
                  href="/list-your-venue"
                  className="rounded-full bg-accent px-3 py-1.5 text-[12px] font-bold"
                >
                  List venues
                </Link>
              </div>
            </div>
            <div
              data-about-float
              className="relative min-h-[220px] overflow-hidden rounded-[28px] shadow-[0_16px_40px_-28px_rgba(15,15,20,0.35)] ring-1 ring-[#D4AF37]/25"
            >
              <Image
                src="/images/about/lux-champagne.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 22vw"
              />
            </div>
          </div>
        </div>

        <div data-about-stagger className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.title}
              data-about-item
              className={`rounded-[24px] p-6 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.35)] transition-transform duration-500 hover:-translate-y-1 ${item.tone}`}
            >
              <Sparkles className="size-5 opacity-70" />
              <h3 className="mt-4 text-[18px] font-extrabold">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed opacity-80">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="mt-12 bg-[#0c0c0e] py-12 text-white md:mt-16 md:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-[#E8D59A] uppercase">
                What we cover
              </p>
              <h2 className="mt-2 text-[28px] font-extrabold tracking-tight md:text-[34px]">
                Four ways to spend a night out
              </h2>
            </div>
            <Link
              href="/"
              className="text-[13px] font-bold tracking-wide text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              Back to home
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pillars.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:bg-white/[0.07]"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-[16px] font-extrabold tracking-wide uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/75">
                      {item.body}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-extrabold text-[#E8D59A]">
                      Explore <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <AboutLoveSection />

      <Container className="mt-12 md:mt-16">
        <div
          data-about-reveal
          className="grid gap-4 rounded-[28px] border border-[#D4AF37]/20 bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(15,15,20,0.35)] sm:grid-cols-2 lg:grid-cols-4 lg:p-7"
        >
          {trusts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#F8F1DE] text-[#7a5f18] dark:bg-[#2a2410] dark:text-[#E8D59A]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold tracking-wide text-text uppercase">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-text-secondary">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          data-about-reveal
          className="mt-10 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1a0f1f_0%,#FF005B_48%,#D4AF37_100%)] p-7 text-white shadow-[0_30px_70px_-30px_rgba(255,0,91,0.45)] md:flex md:items-center md:justify-between md:p-10"
        >
          <div className="max-w-[520px]">
            <h2 className="text-[26px] font-extrabold tracking-tight md:text-[32px]">
              Got a show or a space?
            </h2>
            <p className="mt-2 text-[14px] text-white/85 md:text-[15px]">
              List events and venues on VYBE, or write to us if you run cinemas and
              activity parks.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-0">
            <Link
              href="/partner-with-us"
              className="rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#1a1a1a] transition-transform hover:scale-[1.03]"
            >
              Partner with us
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-5 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-[13px] text-text-muted">
          {siteConfig.contact.addressLines.join(" · ")} ·{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-text">
            {siteConfig.contact.email}
          </a>
        </p>
      </Container>
    </div>
  );
}
