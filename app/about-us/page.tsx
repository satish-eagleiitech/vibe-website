import Image from "next/image";
import Link from "next/link";
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
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";

export const metadata = { title: "About Us" };

const featured = {
  tag: "Our story",
  title: "One app for every plan in the city",
  body: "Showtimes, concerts, adventures and sports slots used to live in different chats and screenshots. VYBE brings them together — discover, book, and walk in with a QR.",
  image: "/images/about/about-story-hero.jpg",
  read: "Built in Hyderabad",
};

const storyCards = [
  {
    tag: "Movies",
    title: "Seats, snacks and offers in one flow",
    body: "Pick a show, grab F&B, apply bank offers, and pay — without bouncing between apps.",
    image: "/images/about/about-card-movies.jpg",
    href: "/movies",
  },
  {
    tag: "Events",
    title: "Nights worth dressing up for",
    body: "Comedy, live music, workshops and fests curated for your city.",
    image: "/images/about/about-card-events.jpg",
    href: "/events",
  },
  {
    tag: "Play",
    title: "Book the turf, not the group chat",
    body: "Courts, nets and game zones with clear hourly slots and free cancellation windows.",
    image: "/images/about/about-card-play.jpg",
    href: "/play",
  },
];

const pillars = [
  {
    title: "Movies",
    body: "Showtimes, seats, food and bank offers — checkout that feels finished.",
    href: "/movies",
    image: "/images/about/about-pillar-movies.jpg",
  },
  {
    title: "Events",
    body: "Concerts, comedy, workshops and nightlife near you.",
    href: "/events",
    image: "/images/about/about-pillar-events.jpg",
  },
  {
    title: "Activities",
    body: "Parks, fitness, adventures and weekend escapes.",
    href: "/activities",
    image: "/images/about/about-pillar-activities.jpg",
  },
  {
    title: "Play",
    body: "Turfs, courts and game zones you can book by the hour.",
    href: "/play",
    image: "/images/about/about-pillar-play.jpg",
  },
];

const values = [
  {
    title: "Clear prices",
    body: "Fees and refunds shown before you pay — no surprise charges at the gate.",
    tone: "bg-[#FFE8A3] text-[#1a1a1a]",
  },
  {
    title: "City-first discovery",
    body: "Listings follow your city so you see plans you can actually reach tonight.",
    tone: "bg-[#C8F0E0] text-[#0f3d32]",
  },
  {
    title: "Tickets that stick",
    body: "QR, booking ID and directions live under Profile → Bookings on this device.",
    tone: "bg-[#FFD0E0] text-[#5c1030]",
  },
];

const trusts = [
  { icon: Ticket, title: "Instant tickets", body: "QR ready the moment you pay" },
  { icon: ShieldCheck, title: "Secure checkout", body: "Payments via trusted partners" },
  { icon: Zap, title: "Fast discovery", body: "City-aware movies, events & play" },
  { icon: QrCode, title: "Walk-in ready", body: "Screenshots welcome at entry" },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden pb-16 md:pb-24">
      {/* Hero */}
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(255,0,91,0.12),_transparent_55%),radial-gradient(ellipse_at_80%_20%,_rgba(56,189,248,0.14),_transparent_45%)]"
        />
        <Container className="relative text-center">
          <span className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-text-secondary uppercase shadow-sm">
            About
          </span>
          <h1 className="mx-auto mt-5 max-w-[18ch] text-[36px] leading-[1.05] font-extrabold tracking-tight text-text md:text-[52px]">
            Practical plans that help you move{" "}
            <em className="font-[family-name:var(--font-fraunces)] font-semibold text-accent italic">
              faster.
            </em>
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-relaxed text-text-secondary md:text-[16px]">
            {siteConfig.name} is {siteConfig.tagline.toLowerCase()} — discover what&apos;s on,
            book in minutes, and keep every ticket in one place.
          </p>
        </Container>
      </section>

      <Container className="space-y-8 md:space-y-10">
        {/* Featured editorial card */}
        <article className="overflow-hidden rounded-[28px] bg-surface shadow-[0_24px_60px_-28px_rgba(15,15,20,0.35)] md:grid md:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[240px] md:min-h-[360px]">
            <Image
              src={featured.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <span className="inline-flex w-fit rounded-full bg-surface-muted px-3 py-1 text-[11px] font-extrabold tracking-wide text-text-secondary uppercase">
              {featured.tag}
            </span>
            <h2 className="mt-4 text-[26px] leading-tight font-extrabold tracking-tight text-text md:text-[32px]">
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

        {/* Whenevr-style 3 cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {storyCards.map((card) => (
            <Link
              key={card.tag}
              href={card.href}
              className="group overflow-hidden rounded-[28px] bg-surface shadow-[0_20px_50px_-24px_rgba(15,15,20,0.35)] transition-transform hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/11]">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
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

        {/* AKINA-style asymmetric rows */}
        <div className="space-y-6 md:space-y-8">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]">
            <div className="overflow-hidden rounded-[28px] bg-[#D9D6FF] text-[#1b1640] md:grid md:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[200px] md:min-h-full">
                <Image
                  src="/images/about/about-why-park.jpg"
                  alt=""
                  fill
                  className="object-cover"
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
            <div className="flex flex-col justify-center rounded-[28px] bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.3)] lg:p-7">
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

          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(200px,0.55fr)_minmax(0,1.2fr)_minmax(180px,0.55fr)]">
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
            <div className="rounded-[28px] bg-[#2A1830] p-6 text-white md:p-8">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-accent uppercase">
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
            <div className="relative min-h-[220px] overflow-hidden rounded-[28px] shadow-[0_16px_40px_-28px_rgba(15,15,20,0.35)]">
              <Image
                src="/images/about/about-disco-drink.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 22vw"
              />
            </div>
          </div>
        </div>

        {/* Colorful value cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.title}
              className={`rounded-[24px] p-6 shadow-[0_16px_40px_-28px_rgba(15,15,20,0.35)] ${item.tone}`}
            >
              <Sparkles className="size-5 opacity-70" />
              <h3 className="mt-4 text-[18px] font-extrabold">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed opacity-80">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* GAZU-style category band */}
      <section className="mt-12 bg-[#121214] py-12 text-white md:mt-16 md:py-16">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-accent uppercase">
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-3.5 transition-colors hover:border-accent/50 hover:bg-white/[0.07]"
              >
                <div className="relative h-[88px] w-[72px] shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="72px"
                  />
                </div>
                <div className="min-w-0 py-1">
                  <h3 className="text-[16px] font-extrabold tracking-wide uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/65">
                    {item.body}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-extrabold text-accent">
                    Explore <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <AboutLoveSection />

      <Container className="mt-12 md:mt-16">
        {/* Trust strip */}
        <div className="grid gap-4 rounded-[28px] border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-7">
          {trusts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface-muted text-text">
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

        {/* CTA */}
        <div className="mt-10 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#FF005B_0%,#FF4D8D_42%,#38BDF8_100%)] p-7 text-white md:flex md:items-center md:justify-between md:p-10">
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
              className="rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#1a1a1a]"
            >
              Partner with us
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-5 py-2.5 text-[13px] font-extrabold text-white"
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
